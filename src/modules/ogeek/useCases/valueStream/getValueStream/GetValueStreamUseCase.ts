/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { StartAndEndDateOfWeekDto } from '../../../../ogeek/infra/dtos/valueStreamsByWeek/startAndEndDateOfWeek.dto';
import { ActualPlanAndWorkLogDto } from '../../../infra/dtos/actualPlansAndWorkLogs.dto';
import { InputGetPlanWLDto } from '../../../infra/dtos/valueStreamsByWeek/inputGetPlanWL.dto';
import { InputValueStreamByWeekDto } from '../../../infra/dtos/valueStreamsByWeek/inputValueStream.dto';
import { ValueStreamsByWeekDto } from '../../../infra/dtos/valueStreamsByWeek/valueStreamsByWeek.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { UserMap } from '../../../mappers/userMap';
import { ValueStreamMap } from '../../../mappers/valueStreamMap';
import { ValueStreamsByWeekMap } from '../../../mappers/valueStreamsByWeekMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { IValueStreamRepo } from '../../../repos/valueStreamRepo';
import { MomentService } from '../../moment/configMomentService/ConfigMomentService';
import { GetValueStreamError } from './GetValueStreamErrors';

type Response = Either<
    AppError.UnexpectedError | GetValueStreamError.FailToGetValueStream,
    Result<ValueStreamsByWeekDto>
>;

interface ServerResponse {
    data: ActualPlanAndWorkLogDto[];
}
@Injectable()
export class GetValueStreamUseCase
    implements IUseCase<{ userId: number; week: number }, Promise<Response>> {
    constructor(
        @Inject('IValueStreamRepo')
        public readonly valueStreamRepo: IValueStreamRepo,
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWLRepo: ICommittedWorkloadRepo,
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWLRepo: IPlannedWorkloadRepo,
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,
    ) {}

    async getWeekByEachUseCase(inputValueStreamByWeekDto: InputValueStreamByWeekDto): Promise<StartAndEndDateOfWeekDto> {
        const planNotClosed = await this.plannedWLRepo.getPlanWLNotClosed(
            { userId: inputValueStreamByWeekDto.userId,
              startDateOfWeek: MomentService.firstDateOfWeek(inputValueStreamByWeekDto.week),
         } as InputGetPlanWLDto,
        );
        if (planNotClosed) {
            return {
                startDateOfWeek: planNotClosed.startDate,
                endDateOfWeek: moment(planNotClosed.startDate).add(7, 'days').toDate(),
            };
        }
        return {
            startDateOfWeek: MomentService.firstDateOfWeek(inputValueStreamByWeekDto.week),
            endDateOfWeek: MomentService.lastDateOfWeek(inputValueStreamByWeekDto.week),
        };

    }

    async execute(inputValueStreamByWeekDto: InputValueStreamByWeekDto): Promise<Response> {
        try {
            // get actual plans and worklogs
            const url =
                `${process.env.MOCK_URL}/api/overview/value-stream?userid=${inputValueStreamByWeekDto.userId}&week=${inputValueStreamByWeekDto.week}`;
            const request = await Axios.get<ServerResponse>(url, {
                headers: {
                    'x-api-key': process.env.MOCK_API_KEY,
                },
            });
            const response = request.data.data;
            const actualPlanAndWorkLogDtos = response;

            const startAndEndDateOfWeek = await this.getWeekByEachUseCase(inputValueStreamByWeekDto);
            const user = await this.userRepo.findById(inputValueStreamByWeekDto.userId);
            const valueStreams = await this.valueStreamRepo.findAll();
            const committedWLs = await this.committedWLRepo.findByUserIdValueStream(
                inputValueStreamByWeekDto.userId,
                startAndEndDateOfWeek.startDateOfWeek,
                startAndEndDateOfWeek.endDateOfWeek,
            );
            const plannedWLs = await this.plannedWLRepo.findByUserId({
                ...startAndEndDateOfWeek,
                userId: inputValueStreamByWeekDto.userId,
            } as InputGetPlanWLDto);

            const committedWLDtos = CommittedWorkloadMap.fromDomainAll(committedWLs);
            const plannedWLDtos = PlannedWorkloadMap.fromDomainAll(plannedWLs);
            const valueStreamDtos = ValueStreamMap.fromDomainAll(valueStreams);
            const userDto = UserMap.fromDomain(user);

            const valueStreamsByWeekDto = ValueStreamsByWeekMap.combineAllDto(
                committedWLDtos,
                plannedWLDtos,
                actualPlanAndWorkLogDtos,
                valueStreamDtos,
                userDto,
                inputValueStreamByWeekDto.week,
                startAndEndDateOfWeek.startDateOfWeek,
                startAndEndDateOfWeek.endDateOfWeek,
            );

            if (!valueStreamsByWeekDto) {
                return left(
                    new GetValueStreamError.FailToGetValueStream(),
                ) as Response;
            }
            return right(Result.ok(valueStreamsByWeekDto));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

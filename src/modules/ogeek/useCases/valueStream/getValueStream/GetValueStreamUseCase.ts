/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
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
import { GetValueStreamError } from './GetValueStreamErrors';

type Response = Either<
    AppError.UnexpectedError | GetValueStreamError.ValueStreamNotFound,
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

    async execute(params: InputValueStreamByWeekDto): Promise<Response> {
        try {
            // get actual plans and worklogs
            const url = `${process.env.MOCK_URL}/api/overview/value-stream?userid=${params.userId}&week=${params.week}`;
            const request = await Axios.get<ServerResponse>(url, {
                headers: {
                    'x-api-key': process.env.MOCK_API_KEY,
                },
            });
            const response = request.data.data;
            const actualPlanAndWorkLogDtos = response;

            // eslint-disable-next-line import/namespace
            const dateOfWeek = moment()
                .utcOffset(420)
                .week(params.week)
                .format();
            const numDateOfWeek = moment(dateOfWeek).format('e');
            const startDateOfWeek = moment(dateOfWeek)
                .utcOffset(420)
                .add(-numDateOfWeek, 'days')
                .startOf('day')
                .format();
            const endDateOfWeek = moment(startDateOfWeek)
                .utcOffset(420)
                .add(6, 'days')
                .endOf('day')
                .format();

            const user = await this.userRepo.findById(params.userId);
            const valueStreams = await this.valueStreamRepo.findAll();
            const committedWLs = await this.committedWLRepo.findByUserIdValueStream(
                params.userId,
                startDateOfWeek,
                endDateOfWeek,
            );

            const plannedWLs = await this.plannedWLRepo.findByUserId({
                startDateOfWeek,
                endDateOfWeek,
                userId: params.userId,
            } as InputGetPlanWLDto);

            const committedWLDtos =
                CommittedWorkloadMap.fromDomainAll(committedWLs);
            const plannedWLDtos = PlannedWorkloadMap.fromDomainAll(plannedWLs);
            const valueStreamDtos = ValueStreamMap.fromDomainAll(valueStreams);
            const userDto = UserMap.fromDomain(user);

            const startDate = moment(startDateOfWeek)
                .add(1, 'days')
                .format('DD-MM-YYYY');
            const endDate = moment(endDateOfWeek).format('DD-MM-YYYY');

            const valueStreamsByWeekDto = ValueStreamsByWeekMap.combineAllDto(
                committedWLDtos,
                plannedWLDtos,
                actualPlanAndWorkLogDtos,
                valueStreamDtos,
                userDto,
                params.week,
                startDate,
                endDate,
            );

            if (!valueStreamsByWeekDto) {
                return left(
                    new GetValueStreamError.ValueStreamNotFound(),
                ) as Response;
            }
            return right(Result.ok(valueStreamsByWeekDto));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

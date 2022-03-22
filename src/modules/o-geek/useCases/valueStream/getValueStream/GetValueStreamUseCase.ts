/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import { ICommittedWorkloadRepo } from 'modules/o-geek/repos/committedWorkloadRepo';
import { IPlannedWorkloadRepo } from 'modules/o-geek/repos/plannedWorkloadRepo';
import { IUserRepo } from 'modules/o-geek/repos/userRepo';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ActualPlanAndWorkLogDto } from '../../../../../modules/o-geek/infra/dtos/actualPlansAndWorkLogs.dto';
import { InputGetPlanWLDto } from '../../../../../modules/o-geek/infra/dtos/ValueStreamsByWeek/inputGetPlanWL.dto';
import { InputValueStreamByWeekDto } from '../../../../../modules/o-geek/infra/dtos/ValueStreamsByWeek/inputValueStream.dto';
import { ValueStreamsByWeekDto } from '../../../../../modules/o-geek/infra/dtos/ValueStreamsByWeek/valueStreamsByWeek.dto';
import { CommittedWorkloadMap } from '../../../../../modules/o-geek/mappers/committedWorkloadMap';
import { PlannedWorkloadMap } from '../../../../../modules/o-geek/mappers/plannedWorkloadMap';
import { UserMap } from '../../../../../modules/o-geek/mappers/userMap';
import { ValueStreamMap } from '../../../../../modules/o-geek/mappers/valueStreamMap';
import { ValueStreamsByWeekMap } from '../../../../../modules/o-geek/mappers/valueStreamsByWeekMap';
import {
    CommittedWorkloadRepository,
    PlannedWorkloadRepository,
    UserRepository,
} from '../../../../../modules/o-geek/repos';
import { IValueStreamRepo, ValueStreamRepository } from '../../../../../modules/o-geek/repos/valueStreamRepo';
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
            moment.updateLocale('en', { week: { dow: 6 } });
            const dateOfWeek = moment()
                .utcOffset(420)
                .week(params.week)
                .format();
            const numDateOfWeek = moment(dateOfWeek).format('e');
            const startDateOfWeek = moment(dateOfWeek)
                .utcOffset(420)
                .add(-numDateOfWeek, 'days')
                .startOf('day')
                .format('MM/DD/YYYY');
            const endDateOfWeek = moment(startDateOfWeek)
                .utcOffset(420)
                .add(6, 'days')
                .endOf('day')
                .format('MM/DD/YYYY');

            const user = await this.userRepo.findById(params.userId);
            const valueStreams = await this.valueStreamRepo.findAll();
            const committedWLs = await this.committedWLRepo.findByUserId(
                params.userId,
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

            const valueStreamsByWeekDto = ValueStreamsByWeekMap.combineAllDto(
                committedWLDtos,
                plannedWLDtos,
                actualPlanAndWorkLogDtos,
                valueStreamDtos,
                userDto,
                params.week,
                startDateOfWeek,
                endDateOfWeek,
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

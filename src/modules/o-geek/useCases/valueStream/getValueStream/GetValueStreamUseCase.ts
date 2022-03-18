/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import Axios from 'axios';
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
import { CommittedWorkloadRepository, PlannedWorkloadRepository, UserRepository } from '../../../../../modules/o-geek/repos';
import { ValueStreamRepository } from '../../../../../modules/o-geek/repos/valueStreamRepo';
import { GetValueStreamError } from './GetValueStreamErrors';

type Response = Either<
    AppError.UnexpectedError | GetValueStreamError.ValueStreamNotFound,
    Result<ValueStreamsByWeekDto>
>;

@Injectable()
export class GetValueStreamUseCase
    implements IUseCase<{userId: number; week: number} , Promise<Response> > {
    constructor(
        public readonly valueStreamRepo: ValueStreamRepository,
        public readonly committedWLRepo: CommittedWorkloadRepository,
        public readonly plannedWLRepo: PlannedWorkloadRepository,
        public readonly userRepo: UserRepository,
    ) {}

    async execute(params: InputValueStreamByWeekDto): Promise<Response> {
        try {
            // get actual plans and worklogs
            const url = `https://mock.o-geek.geekup.io/api/overview/value-stream?userid=${params.userId}&week=${params.week}`;
            const request = await Axios.get(url, {
                headers: {
                    'x-api-key': 'API_KEY_EXAMPLE',
                },
            });
            const actualPlanAndWorkLogDtos = request.data as ActualPlanAndWorkLogDto;

            // eslint-disable-next-line import/namespace
            moment.updateLocale('en', { week: { dow: 6, doy: 8 } });
            const startDateOfWeek = moment().clone().startOf('year').add(params.week, 'weeks').toDate();
            const endDateOfWeek = moment().clone().startOf('year').add((params.week + 1), 'weeks').toDate();

            const user = await this.userRepo.findById(params.userId);
            const valueStreams = await this.valueStreamRepo.findAll();
            const committedWLs = await this.committedWLRepo.findByUserId(params.userId);
            const plannedWLs = await this.plannedWLRepo.findByUserId(
                { startDateOfWeek, endDateOfWeek, userId: params.userId } as InputGetPlanWLDto);

            const committedWLDtos = CommittedWorkloadMap.fromDomainAll(committedWLs);
            const plannedWLDtos = PlannedWorkloadMap.fromDomainAll(plannedWLs);
            const valueStreamDtos = ValueStreamMap.fromDomainAll(valueStreams);
            const userDto = UserMap.fromDomain(user);

            const valueStreamsByWeekDto = ValueStreamsByWeekMap.combineAllDto(
                committedWLDtos, plannedWLDtos, actualPlanAndWorkLogDtos,
                valueStreamDtos, userDto, params.week, startDateOfWeek, endDateOfWeek);

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


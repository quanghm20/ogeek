/* eslint-disable @typescript-eslint/tslint/config */
import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ICommittedWorkloadRepo } from '../../../../../modules/o-geek/repos/committedWorkloadRepo';
import { IPlannedWorkloadRepo } from '../../../../../modules/o-geek/repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../../../modules/o-geek/repos/userRepo';
import { ActualWorkloadListDto } from '../../../infra/dtos/workloadListByWeek/actualWorkloadList.dto';
import { InputGetPlansWLDto } from '../../../infra/dtos/workloadListByWeek/inputGetPlans.dto';
import { InputWeekDto } from '../../../infra/dtos/workloadListByWeek/inputWeek.dto';
import { WorkloadListByWeekDto } from '../../../infra/dtos/workloadListByWeek/workloadListByWeek.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { UserMap } from '../../../mappers/userMap';
import { WorkloadListByWeekMap } from '../../../mappers/workloadListByWeekMap';
import { GetWorkloadListError } from './GetWorkloadListErrors';

type Response = Either<
    AppError.UnexpectedError | GetWorkloadListError.WorkloadListNotFound,
    Result<WorkloadListByWeekDto[]>
>;

interface ServerResponse {
    data: ActualWorkloadListDto[];
}

@Injectable()
export class GetWorkloadListUseCase
    implements IUseCase<{ week: number }, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWLRepo: ICommittedWorkloadRepo,
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWLRepo: IPlannedWorkloadRepo,
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,
    ) {}

    async execute(params: InputWeekDto): Promise<Response> {
        try {
            const url = `${process.env.MOCK_URL}/api/overview/list-workload`;
            const request = await Axios.get<ServerResponse>(url, {
                headers: {
                    'x-api-key': process.env.MOCK_API_KEY,
                },
            });
            const response = request.data.data;

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
                .format();
            const endDateOfWeek = moment(startDateOfWeek)
                .utcOffset(420)
                .add(6, 'days')
                .endOf('day')
                .format();

            const users = await this.userRepo.findAll();
            const committedWorkloads = await this.committedWLRepo.findAll();
            const plannedWorkloads = await this.plannedWLRepo.findAllByWeek({
                startDateOfWeek,
                endDateOfWeek,
            } as InputGetPlansWLDto);

            const committedWLDtos =
                CommittedWorkloadMap.fromDomainAll(committedWorkloads);
            const plannedWLDtos =
                PlannedWorkloadMap.fromDomainAll(plannedWorkloads);
            const userDtos = UserMap.fromDomainAll(users);

            const workloadListByWeekDto = WorkloadListByWeekMap.combineAllDto(
                committedWLDtos,
                plannedWLDtos,
                userDtos,
                response,
            );

            if (!workloadListByWeekDto) {
                return left(
                    new GetWorkloadListError.WorkloadListNotFound(),
                ) as Response;
            }
            return right(Result.ok(workloadListByWeekDto));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

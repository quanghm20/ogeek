/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import * as moment from 'moment';

import { RoleType } from '../../../../../common/constants/role-type';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { IssueMap } from '../../../../../modules/o-geek/mappers/issueMap';
import { ICommittedWorkloadRepo } from '../../../../../modules/o-geek/repos/committedWorkloadRepo';
import { IIssueRepo } from '../../../../../modules/o-geek/repos/issueRepo';
import { IPlannedWorkloadRepo } from '../../../../../modules/o-geek/repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../../../modules/o-geek/repos/userRepo';
import { ActualWorkloadListDto } from '../../../infra/dtos/workloadListByWeek/actualWorkloadList.dto';
import { InputListWorkloadDto } from '../../../infra/dtos/workloadListByWeek/inputListWorkload.dto';
import { StartEndDateOfWeekWLInputDto } from '../../../infra/dtos/workloadListByWeek/startEndDateOfWeekInput.dto';
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
    implements IUseCase<{ week: number; userId: number }, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWLRepo: ICommittedWorkloadRepo,
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWLRepo: IPlannedWorkloadRepo,
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,
        @Inject('IIssueRepo')
        public readonly issueRepo: IIssueRepo,
    ) {}

    async execute(params: InputListWorkloadDto): Promise<Response> {
        try {
            const user = await this.userRepo.findById(params.userId);

            if (user.role !== RoleType.ADMIN) {
                return left(new GetWorkloadListError.Forbidden()) as Response;
            }
            if (params.week < 1 && params.week > 52) {
                return left(new GetWorkloadListError.WeekError()) as Response;
            }

            const url = `${process.env.MOCK_URL}/api/overview/list-workload`;
            const request = await Axios.get<ServerResponse>(url, {
                headers: {
                    'x-api-key': process.env.MOCK_API_KEY,
                },
            });
            const response = request.data.data;

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

            const users = await this.userRepo.findAllUsers();
            const issues = await this.issueRepo.findAllByWeek({
                startDateOfWeek,
                endDateOfWeek,
            } as StartEndDateOfWeekWLInputDto);
            const committedWorkloads = await this.committedWLRepo.findAllByWeek(
                {
                    startDateOfWeek,
                    endDateOfWeek,
                } as StartEndDateOfWeekWLInputDto,
            );
            const plannedWorkloads = await this.plannedWLRepo.findAllByWeek({
                startDateOfWeek,
                endDateOfWeek,
            } as StartEndDateOfWeekWLInputDto);

            const committedWLDtos =
                CommittedWorkloadMap.fromDomainAll(committedWorkloads);
            const plannedWLDtos =
                PlannedWorkloadMap.fromDomainAll(plannedWorkloads);

            const userDtos = UserMap.fromDomainAll(users);
            const issueDtos = IssueMap.fromDomainAll(issues);

            const workloadListByWeekDto = WorkloadListByWeekMap.combineAllDto(
                committedWLDtos,
                plannedWLDtos,
                userDtos,
                response,
                issueDtos,
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

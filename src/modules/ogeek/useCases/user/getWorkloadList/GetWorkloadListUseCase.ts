/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { RoleType } from '../../../../../common/constants/roleType';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { SenteService } from '../../../../../shared/services/sente.service';
import { ActualWorkloadListDto } from '../../../infra/dtos/workloadListByWeek/actualWorkloadList.dto';
import { InputListWorkloadDto } from '../../../infra/dtos/workloadListByWeek/inputListWorkload.dto';
import { StartEndDateOfWeekWLInputDto } from '../../../infra/dtos/workloadListByWeek/startEndDateOfWeekInput.dto';
import { WorkloadListByWeekDto } from '../../../infra/dtos/workloadListByWeek/workloadListByWeek.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { IssueMap } from '../../../mappers/issueMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { UserMap } from '../../../mappers/userMap';
import { WorkloadListByWeekMap } from '../../../mappers/workloadListByWeekMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IIssueRepo } from '../../../repos/issueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
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
        public readonly senteService: SenteService,
    ) {}

    async execute(params: InputListWorkloadDto): Promise<Response> {
        try {
            const user = await this.userRepo.findById(params.userId);

            const week = Number(params.week);

            if (user.role !== RoleType.PP) {
                return left(new GetWorkloadListError.Forbidden()) as Response;
            }
            if (week < 1 || week > 52) {
                return left(new GetWorkloadListError.WeekError()) as Response;
            }

            const request =
                await this.senteService.getOverviewListWorkload<ServerResponse>(
                    params.week.toString(),
                );
            const response = request.data.data;

            const startDateOfWeek = MomentService.firstDateOfWeek(week);
            const endDateOfWeek = MomentService.lastDateOfWeek(week);

            const users = await this.userRepo.findAllUser();
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

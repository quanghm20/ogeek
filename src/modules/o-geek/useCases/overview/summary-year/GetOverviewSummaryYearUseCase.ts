/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

// import { forEach } from 'lodash';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result } from '../../../../../core/logic/Result';
import { CommittedWorkload } from '../../../domain/committedWorkload';
import { DomainId } from '../../../domain/domainId';
import { PlannedWorkload } from '../../../domain/plannedWorkload';
import { CommittedWorkloadDto } from '../../../infra/dtos/committedWorkload.dto';
// import { OverviewSummaryYearDto } from '../../../infra/dtos/overviewSummaryYear.dto';
import { PlannedWorkloadDto } from '../../../infra/dtos/plannedWorkload.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { GetOverviewSummaryYearErrors } from './GetOverviewSummaryYearErrors';

type Response = Either<
    AppError.UnexpectedError | GetOverviewSummaryYearErrors.UserNotFound,
    Result<CommittedWorkload[]> | Result<PlannedWorkload[]>
>;

@Injectable()
export class GetOverviewSummaryYearUseCase
    implements IUseCase<DomainId | number, Promise<Response>> {
    constructor(
        @Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
        @Inject('IPlannedWorkloadRepo') public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
    ) {}

    async execute(userId: DomainId | number): Promise<Response> {
        try {
                // array domain committedWorkload
                const committedWorkload = await this.committedWorkloadRepo.findByUserId(userId);
                // array domain plannedWorkload
                const plannedWorkload = await this.plannedWorkloadRepo.findByUserId(userId);

                const committedWorkloadArray = Array<CommittedWorkloadDto>();
                committedWorkload.forEach(function(committedWorkloadItem) {
                    const committedWorkloadDto = CommittedWorkloadMap.fromDomain(committedWorkloadItem);
                    committedWorkloadArray.push(committedWorkloadDto);
                });

                const plannedWorkloadArray = Array<PlannedWorkloadDto>();
                plannedWorkload.forEach(function(plannedWorkloadItem) {
                    const plannedWorkloadDto = PlannedWorkloadMap.fromDomain(plannedWorkloadItem);
                    plannedWorkloadArray.push(plannedWorkloadDto);
                });

                // const overviewSummaryYearArray = Array<OverviewSummaryYearDto>();
                // committedWorkloadArray.forEach(function(committedWorkloadItem) {
                //     plannedWorkloadArray.forEach(function(plannedWorkloadItem) {
                //         if (committedWorkloadItem.contributedValue.id === plannedWorkloadItem.contributedValue.id) {
                //             OverviewSummaryYearDto.td' = committedWorkloadItem.year;
                //             overviewSummaryYearDto.committedWorkload = committedWorkloadItem.workload;
                //             overviewSummaryYearDto.plannedWorkload = plannedWorkloadItem.workload;
                //             overviewSummaryYearArray.push(overviewSummaryYearDto);
                //         }
                //     }
                // }
                // if (committedWorkload) {
                //     return right(Result.ok(committedWorkload));
                // }

                return left(
                    new GetOverviewSummaryYearErrors.UserNotFound(userId.toString()),
                ) as Response;

        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

// import * as moment from 'moment';
// import { Equal } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
// import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
// import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
// import { PlannedWorkload } from '../../../domain/plannedWorkload';
// import { PlannedWorkloadEntity } from '../../../infra/database/entities/plannedWorkload.entity';
// import { CreatePlannedWorkloadsListDto } from '../../../infra/dtos/createPlannedWorkload/createPlannedWorkloadsList.dto';
import { GetPotentialIssuesInputDto } from '../../../infra/dtos/getPotentialIssues/getPotentialIssuesInput.dto';
// import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetPotentialIssuesErrors } from './GetPotentialIssuesErrors';

type Response = Either<
  AppError.UnexpectedError | GetPotentialIssuesErrors.GetPotentialIssuesFailed,
  // Result<GetPotentialIssuesInputDto>
  Result<any>
>;

@Injectable()
export class GetPotentialIssuesUseCase
  implements IUseCase<GetPotentialIssuesInputDto, Promise<Response>>
{
  constructor(
    @Inject('IPlannedWorkloadRepo')
    public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
    @Inject('ICommittedWorkloadRepo')
    public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    @Inject('IContributedValueRepo')
    public readonly contributedValueloadRepo: IContributedValueRepo,
    @Inject('IUserRepo') public readonly userRepo: IUserRepo,
  ) { }

  async execute(
    getPotentialIssuesInputDto: GetPotentialIssuesInputDto,
    // picId: number,
  ): Promise<Response> {
    const { startWeek, startYear, endWeek, endYear, userId } = getPotentialIssuesInputDto;

    const user = await this.userRepo.findById(userId);
    if (!user) {
      return left(
        new GetPotentialIssuesErrors.UserNotFound(),
      ) as Response;
    }

    const startDateOfStartWeek = MomentService.firstDateOfWeekByYear(startWeek, startYear);
    const startDateOfEndWeek = MomentService.firstDateOfWeekByYear(endWeek, endYear);
    const potentialIssuesHistoryInTimeRange = await this.userRepo.findPotentialIssuesHistoryInTimeRange(
      userId,
      startDateOfStartWeek,
      startDateOfEndWeek,
    );

    try {
      //   // create planned workload based on createPlannedWorkloadDtos
      //   for (const plannedWorkloadDto of plannedWorkloads) {
      //     const { contributedValueId, committedWorkloadId, workload } = plannedWorkloadDto;

      //     const committedWorkload = await this.committedWorkloadRepo.findById(committedWorkloadId);
      //     const contributedValue = await this.contributedValueloadRepo.findById(contributedValueId);

      //     const plannedWorkload = PlannedWorkload.create(
      //       {
      //         reason,
      //         user,
      //         contributedValue,
      //         committedWorkload,
      //         startDate: new Date(formattedStartDate.toISOString()),
      //         plannedWorkload: workload,
      //         status: newPlannedWorkloadStatus,
      //         createdBy: userId,
      //       },
      //       new UniqueEntityID(uuidv4()),
      //     );

      //     const plannedWorkloadEntity = PlannedWorkloadMap.toEntity(plannedWorkload.getValue());
      //     plannedWorkloadEntitiesList.push(plannedWorkloadEntity);
      //   }
      //   const savedPlannedWorkloads = await this.plannedWorkloadRepo.createMany(plannedWorkloadEntitiesList);

      // if (potentialIssuesHistory) {
      // }
      return right(Result.ok(potentialIssuesHistoryInTimeRange));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

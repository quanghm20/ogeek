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
  Result<GetPotentialIssuesInputDto>
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
    picId: number,
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
    await this.userRepo.findPotentialIssuesHistoryInTimeRange(
      userId,
      startDateOfStartWeek,
      startDateOfEndWeek,
    );

    await this.userRepo.findById(picId);

    // const committedWorkloads = await this.committedWorkloadRepo.findByUserIdInTimeRange(
    //   moment(startWeek)
    // )

    // is start date start date of week?
    // const startDateOfWeek = moment(startDate).clone().startOf('week');

    // // validate cannot plan last week
    // const plannedWeek = moment(startDateOfWeek).week();
    // const currentWeek = moment(Date.now()).week();
    // if (plannedWeek < currentWeek) {
    //   return left(
    //     new GetPotentialIssuesErrors.GetPotentialIssuesFailed(),
    //   ) as Response;
    // }

    try {
      //   // format startDate
      //   const formattedStartDate = moment(startDateOfWeek).toDate();

      //   const plannedWorkloadEntitiesList = [] as PlannedWorkloadEntity[];
      //   const user = await this.userRepo.findById(userId);

      //   const oldPlannedWorkloads = await this.plannedWorkloadRepo.find({
      //     user: { id: userId },
      //     startDate: Equal(formattedStartDate),
      //   });

      //   if (!oldPlannedWorkloads) {
      //     return left(
      //       new GetPotentialIssuesErrors.GetPotentialIssuesFailed(),
      //     ) as Response;
      //   }

      //   let newPlannedWorkloadStatus = PlannedWorkloadStatus.PLANNING;

      //   if (oldPlannedWorkloads.length !== 0) {
      //     const closedPlannedWorkloads = oldPlannedWorkloads.filter(plannedWL => plannedWL.isClosed);
      //     // if in planned week, there is any planned wl record is closed, user cannot plan workload
      //     if (closedPlannedWorkloads.length !== 0) {
      //       return left(
      //         new GetPotentialIssuesErrors.GetPotentialIssuesFailed(),
      //       ) as Response;
      //     }

      //     // new planned workloads status is the same old active planned workloads
      //     const activePlannedWorkloads = oldPlannedWorkloads.filter(plannedWL => plannedWL.isActive);
      //     newPlannedWorkloadStatus = activePlannedWorkloads[0].status;

      //     // update old planned workloads' status to ARCHIVED
      //     const currentWeekPlannedWorkloads = await this.plannedWorkloadRepo.find({
      //       user: { id: userId },
      //       startDate: Equal(formattedStartDate.toISOString()),
      //     });

      //     const currentWeekPlannedWorkloadEntites = currentWeekPlannedWorkloads.map(plannedWL => {
      //       plannedWL.deactive(userId);
      //       return PlannedWorkloadMap.toEntity(plannedWL);
      //     });

      //     await this.plannedWorkloadRepo.updateMany(currentWeekPlannedWorkloadEntites);
      //   }

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
      return right(Result.ok(getPotentialIssuesInputDto));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

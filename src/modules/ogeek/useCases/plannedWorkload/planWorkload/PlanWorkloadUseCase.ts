/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Equal } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { PlannedWorkload } from '../../../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../../../infra/database/entities/plannedWorkload.entity';
import { CreatePlannedWorkloadsListDto } from '../../../infra/dtos/createPlannedWorkload/createPlannedWorkloadsList.dto';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { PlanWorkloadErrors } from './PlanWorkloadErrors';

type Response = Either<
  AppError.UnexpectedError | PlanWorkloadErrors.PlanWorkloadFailed,
  Result<PlannedWorkload[]>
>;

@Injectable()
export class PlanWorkloadUseCase
  implements IUseCase<CreatePlannedWorkloadsListDto, Promise<Response>>
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
    createPlannedWorkloadsListDto: CreatePlannedWorkloadsListDto,
    userId: number,
  ): Promise<Response> {
    const { startDate, reason, plannedWorkloads } = createPlannedWorkloadsListDto;
    // is start date start date of week?
    const startDateOfWeek = moment(startDate).clone().startOf('week');

    // validate cannot plan last week
    const plannedWeek = moment(startDateOfWeek).week();
    const currentWeek = moment(Date.now()).week();
    if (plannedWeek < currentWeek) {
      return left(
        new PlanWorkloadErrors.InputValidationFailed(),
      ) as Response;
    }

    try {
      // format startDate
      const formattedStartDate = moment(startDateOfWeek).toDate();

      const plannedWorkloadEntitiesList = [] as PlannedWorkloadEntity[];
      const user = await this.userRepo.findById(userId);

      const oldPlannedWorkloads = await this.plannedWorkloadRepo.find({
        user: { id: userId },
        startDate: Equal(formattedStartDate),
      });

      if (!oldPlannedWorkloads) {
        return left(
          new PlanWorkloadErrors.PlanWorkloadFailed(),
        ) as Response;
      }

      let newPlannedWorkloadStatus = PlannedWorkloadStatus.PLANNING;

      if (oldPlannedWorkloads.length !== 0) {
        const closedPlannedWorkloads = oldPlannedWorkloads.filter(plannedWL => plannedWL.isClosed);
        // if in planned week, there is any planned wl record is closed, user cannot plan workload
        if (closedPlannedWorkloads.length !== 0) {
          return left(
            new PlanWorkloadErrors.PlanWorkloadFailed(),
          ) as Response;
        }

        // new planned workloads status is the same old active planned workloads
        const activePlannedWorkloads = oldPlannedWorkloads.filter(plannedWL => plannedWL.isActive);
        newPlannedWorkloadStatus = activePlannedWorkloads[0].status;

        // update old planned workloads' status to ARCHIVED
        await this.plannedWorkloadRepo.updateMany(
          {
            user: { id: userId },
            startDate: Equal(formattedStartDate.toISOString()),
          },
          {
            status: PlannedWorkloadStatus.ARCHIVE,
          },
        );
      }

      // create planned workload based on createPlannedWorkloadDtos
      for (const plannedWorkloadDto of plannedWorkloads) {
        const { contributedValueId, committedWorkloadId, workload } = plannedWorkloadDto;
        const committedWorkload = await this.committedWorkloadRepo.findById(committedWorkloadId);
        const contributedValue = await this.contributedValueloadRepo.findById(contributedValueId);
        const plannedWorkload = PlannedWorkload.create(
          {
            reason,
            user,
            contributedValue,
            committedWorkload,
            startDate: new Date(formattedStartDate.toISOString()),
            plannedWorkload: workload,
            status: newPlannedWorkloadStatus,
          },
          new UniqueEntityID(uuidv4()),
        );

        const plannedWorkloadEntity = PlannedWorkloadMap.toEntity(plannedWorkload.getValue());
        plannedWorkloadEntitiesList.push(plannedWorkloadEntity);
      }
      const savedPlannedWorkloads = await this.plannedWorkloadRepo.createMany(plannedWorkloadEntitiesList);

      if (savedPlannedWorkloads) {
        return right(Result.ok(savedPlannedWorkloads));
      }
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Equal, Not } from 'typeorm';

import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { StartWeekErrors } from './StartWeekErrors';

type Response = Either<
  AppError.UnexpectedError,
  Result<void>
>;

@Injectable()
export class StartWeekUseCase
  implements IUseCase<Date, Promise<Response>> {
  constructor(
    @Inject('IUserRepo') public readonly userRepo: IUserRepo,
    @Inject('IPlannedWorkloadRepo') public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
  ) { }

  async execute(
    startDate: Date,
    userId: number,
  ): Promise<Response> {
    try {
      const newestPlannedWorkload = await this.plannedWorkloadRepo.findOne(
        {
          user: { id: userId },
          status: PlannedWorkloadStatus.PLANNING,
          startDate: Equal(startDate),
        },
      );

      if (!newestPlannedWorkload) {
        return left(
          new StartWeekErrors.NotPlan(),
        ) as Response;
      }

      // calculate previous week
      const startDateOfpreviousWeek = moment(startDate).subtract(7, 'days').startOf('week').toDate();
      const latestPlannedWorkloadInPreviousWeek = await this.plannedWorkloadRepo.findOne(
        {
          user: { id: userId },
          startDate: Equal(startDateOfpreviousWeek),
          status: Not(PlannedWorkloadStatus.ARCHIVE),
        },
      );

      if (latestPlannedWorkloadInPreviousWeek && !latestPlannedWorkloadInPreviousWeek.isClosed) {
        return left(
          new StartWeekErrors.PreviousWeekNotClose(),
        ) as Response;
      }

      await this.plannedWorkloadRepo.updateMany(
        {
          user: { id: userId },
          startDate: Equal(startDate),
          status: PlannedWorkloadStatus.PLANNING,
        },
        {
          status: PlannedWorkloadStatus.EXECUTING,
        },
      );
      return right(Result.ok());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

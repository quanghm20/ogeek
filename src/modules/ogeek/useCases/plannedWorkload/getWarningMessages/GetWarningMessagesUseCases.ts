/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Equal, Not } from 'typeorm';

import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { WarningMessagesDto } from '../../../infra/dtos/getWarningMessages/warningMessages.dto';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetWarningMessagesErrors } from './GetWarningMessagesErrors';

type Response = Either<
  AppError.UnexpectedError
  | GetWarningMessagesErrors.GetMessagesFailed
  | GetWarningMessagesErrors.LastWeekNotClosed
  | GetWarningMessagesErrors.UserNotFound,
  Result<WarningMessagesDto>
>;

@Injectable()
export class GetWarningMessagesUseCases
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
      const user = await this.userRepo.findById(userId);
      if (!user) {
        return left(
          new GetWarningMessagesErrors.UserNotFound(),
        ) as Response;
      }

      const startDateOfCurrentWeek = moment(startDate).startOf('week').toDate();

      const lastWeekPlannedWorkload = await this.plannedWorkloadRepo.findOne({
        user: { id: userId },
        status: Not(PlannedWorkloadStatus.ARCHIVE),
        startDate: Equal(startDateOfCurrentWeek),
      });
      if (lastWeekPlannedWorkload && !lastWeekPlannedWorkload.isClosed) {
        return left(
          new GetWarningMessagesErrors.LastWeekNotClosed(),
        ) as Response;
      }

      const currentWeekPlannedWorkloads = await this.plannedWorkloadRepo.find({
        user: { id: userId },
        startDate: Equal(startDateOfCurrentWeek),
      });

      // filter all EXECUTING and CLOSED
      const executingOrClosedPlannedWorkload = currentWeekPlannedWorkloads.find(plannedWL => plannedWL.isExecutingOrClosed);
      if (executingOrClosedPlannedWorkload) {
        return right(Result.ok(new WarningMessagesDto(executingOrClosedPlannedWorkload.status, true)));
      }

      // remain only PLANNING => filter created by system
      const plannedWorkloadCreatedByUser = currentWeekPlannedWorkloads.find(plannedWL => plannedWL.isCreatedByUser);
      if (plannedWorkloadCreatedByUser) {
        return right(Result.ok(new WarningMessagesDto(PlannedWorkloadStatus.PLANNING, true)));
      }

      return right(Result.ok(new WarningMessagesDto(PlannedWorkloadStatus.PLANNING, false)));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Equal } from 'typeorm';

import { RADIX } from '../../../../../common/constants/number';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { ExpertiseScopeDto } from '../../../infra/dtos/getPlanHistory/expertiseScope.dto';
import { ValueStreamDto } from '../../../infra/dtos/getPlanHistory/valueStream.dto';
import { WeekDto } from '../../../infra/dtos/week.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetPlannedWorkloadHistoryErrors } from './GetPlannedWorkloadHistoryErrors';

type Response = Either<
  AppError.UnexpectedError | GetPlannedWorkloadHistoryErrors.GetPlannedWorkloadHistoryFailed,
  Result<Map<number, ValueStreamDto>>
>;

@Injectable()
export class GetPlannedWorkloadHistoryUseCase
  implements IUseCase<WeekDto, Promise<Response>>
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
    weekDto: WeekDto,
    userId: number,
  ): Promise<Response> {
    const { week, year } = weekDto;
    try {
      const committedWorkloads = await this.committedWorkloadRepo.findByWeek(userId, weekDto);
      const plannedWorkloads = await this.plannedWorkloadRepo.find(
        {
          user: { id: userId },
          startDate: Equal(MomentService.firstDateOfWeekByYear(weekDto.week, weekDto.year)),
        },
      );

      const committedWorkloadHashedMap = new Map<number, ValueStreamDto>();
      for (const committedWorkload of committedWorkloads) {
        if (!committedWorkloadHashedMap[committedWorkload.getValueStreamId()]) {

          const valueStreamDto = new ValueStreamDto();
          const valueStreamDtoId = committedWorkload.valueStream.id.toString();
          valueStreamDto.id = parseInt(valueStreamDtoId, RADIX);
          valueStreamDto.name = committedWorkload.valueStream.name;

          const expertiseScopeDto = new ExpertiseScopeDto();
          const expertiseScopeDtoId = committedWorkload.expertiseScope.id.toString();
          expertiseScopeDto.id = parseInt(expertiseScopeDtoId, RADIX);
          expertiseScopeDto.name = committedWorkload.expertiseScope.name;
          expertiseScopeDto.plannedWorkloads = plannedWorkloads.filter(function(plannedWL) {
            return moment(plannedWL.startDate).week() === week && moment(plannedWL.startDate).year() === year;
          }).map(function(plannedWL) {
            return plannedWL.plannedWorkload;
          });

          valueStreamDto.expertiseScopes = [expertiseScopeDto];
          committedWorkloadHashedMap.set(committedWorkload.getValueStreamId(), valueStreamDto);
        } else {
          const expertiseScopeDto = new ExpertiseScopeDto();
          const expertiseScopeId = committedWorkload.expertiseScope.id.toString();
          expertiseScopeDto.id = parseInt(expertiseScopeId, RADIX);
          expertiseScopeDto.name = committedWorkload.expertiseScope.name;
          expertiseScopeDto.plannedWorkloads = plannedWorkloads.filter(function(plannedWL) {
            return moment(plannedWL.startDate).week() === week && moment(plannedWL.startDate).year() === year;
          }).map(function(plannedWL) {
            return plannedWL.plannedWorkload;
          });

          committedWorkloadHashedMap.get(committedWorkload.getValueStreamId()).expertiseScopes.push(expertiseScopeDto);
        }
      }

      return right(Result.ok(committedWorkloadHashedMap));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { WorkloadStatus } from '../../../../../common/constants/committed-status';
import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreatePlannedWorkloadsListDto } from '../../../../../modules/o-geek/infra/dtos/createPlannedWorkloadsList.dto';
import { PlannedWorkload } from '../../../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../../../infra/database/entities/plannedWorkload.entity';
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
  implements IUseCase<CreatePlannedWorkloadsListDto, Promise<Response>> {
  constructor(
    @Inject('IPlannedWorkloadRepo') public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
    @Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    @Inject('IContributedValueRepo') public readonly contributedValueloadRepo: IContributedValueRepo,
    @Inject('IUserRepo') public readonly userRepo: IUserRepo,
  ) { }

  async execute(createPlannedWorkloadsListDto: CreatePlannedWorkloadsListDto): Promise<Response> {
    const { startDate, reason, plannedWorkloads, userId } = createPlannedWorkloadsListDto;

    const plannedWorkloadEntitiesList = [] as PlannedWorkloadEntity[];
    const user = await this.userRepo.findById(userId);
    try {
      for (const plannedWorkloadDto of plannedWorkloads) {
        const { contributedValueId, committedWorkloadId, workload } = plannedWorkloadDto;
        // const contributedValue =
        //   await this.contributedValueloadRepo.findByExpertiseScopeAndValueStream(
        //     expertiseScopeId, valueStreamId,
        //   );
        const committedWorkload = await this.committedWorkloadRepo.findById(committedWorkloadId);
        const contributedValue = await this.contributedValueloadRepo.findById(contributedValueId);

        const plannedWorkload = PlannedWorkload.create(
          {
            startDate,
            reason,
            contributedValue,
            user,
            committedWorkload,
            plannedWorkload: workload,
            status: WorkloadStatus.ACTIVE,
          },
          new UniqueEntityID(uuidv4()),
        );

        const plannedWorkloadEntity = PlannedWorkloadMap.toEntity(plannedWorkload.getValue());
        plannedWorkloadEntitiesList.push(plannedWorkloadEntity);
      }
      const savedPlannedWorkloads = await this.plannedWorkloadRepo.createMany(plannedWorkloadEntitiesList);
      if (plannedWorkloads) {
        return right(Result.ok(savedPlannedWorkloads));
      }

      return left(
        new PlanWorkloadErrors.PlanWorkloadFailed(),
      ) as Response;
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

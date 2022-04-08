import { Inject, Injectable } from '@nestjs/common';

import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CommittedWorkload } from '../../../domain/committedWorkload';
import { User } from '../../../domain/user';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { WorkloadDto } from '../../../infra/dtos/workload.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { UserMap } from '../../../mappers/userMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { CreateCommittedWorkloadErrors } from './CreateCommittedWorkloadErrors';
type Response = Either<
    AppError.UnexpectedError | CreateCommittedWorkloadErrors.NotFound,
    Result<CommittedWorkloadShortDto[]>
>;

@Injectable()
export class CreateCommittedWorkloadUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
        @Inject('IContributedValueRepo')
        public readonly contributedValueRepo: IContributedValueRepo,
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
    ) {}
    async execute(
        body: CreateCommittedWorkloadDto,
        member: number,
    ): Promise<Response> {
        try {
            const userId = body.userId;
            const user = await this.userRepo.findById(userId);
            const startDate = new Date(body.startDate);
            const expiredDate = new Date(body.expiredDate);
            const userCreated = await this.userRepo.findById(member);
            const createdBy = UserMap.toEntity(userCreated);
            if (!user) {
                return left(
                    new CreateCommittedWorkloadErrors.NotFound(
                        userId.toString(),
                    ),
                ) as Response;
            }

            const committedWorkloads = await this.createCommittedWorkload(
                body.committedWorkloads,
                user,
                startDate,
                expiredDate,
                createdBy.id,
            );
            const committedWorkloadEntities =
                CommittedWorkloadMap.toEntities(committedWorkloads);

            const oldCommitted = await this.getAndHandleOldCommittedWorkload(
                userId,
                startDate,
            );

            const oldCommittedEntities =
                CommittedWorkloadMap.toEntities(oldCommitted);
            const result =
                await this.committedWorkloadRepo.addCommittedWorkload(
                    committedWorkloadEntities,
                    oldCommittedEntities,
                );
            if (result.length < 0) {
                return left(
                    new AppError.UnexpectedError(
                        'Internal Server Error Exception',
                    ),
                );
            }
            await this.autoGeneratePlanned(result);
            for (const oldCommit of oldCommitted) {
                let plans = await this.plannedWorkloadRepo.findByCommittedId(
                    oldCommit.id.toValue(),
                );

                if (plans) {
                    plans = oldCommit.autoArchivePlannedWorkload(
                        startDate,
                        plans,
                    );
                    const plannedEntities =
                        PlannedWorkloadMap.toEntities(plans);

                    await this.plannedWorkloadRepo.createMany(plannedEntities);
                }
            }
            const committedWorkloadsDto =
                CommittedWorkloadMap.fromCommittedWorkloadShortArray(result);
            return right(Result.ok(committedWorkloadsDto));
        } catch (err) {
            return left(err);
        }
    }
    async createCommittedWorkload(
        committedWorkload: WorkloadDto[],
        user: User,
        startDate: Date,
        expiredDate: Date,
        createdBy?: number,
    ): Promise<CommittedWorkload[]> {
        const commitArray = new Array<CommittedWorkload>();
        for await (const workload of committedWorkload) {
            const contribute = await this.contributedValueRepo.findOne(
                workload.valueStreamId,
                workload.expertiseScopeId,
            );
            if (!contribute) {
                return null;
            }
            const commit = CommittedWorkload.create(
                {
                    createdBy,
                    expiredDate,
                    startDate,
                    user,
                    updatedBy: createdBy,
                    committedWorkload: workload.workload,
                    contributedValue: contribute,
                },
                new UniqueEntityID(),
            ).getValue();
            commitArray.push(commit);
        }
        return commitArray;
    }
    async getAndHandleOldCommittedWorkload(
        userId: number,
        startDate: Date,
    ): Promise<CommittedWorkload[]> {
        const oldCommits = await this.committedWorkloadRepo.findByUserId(
            userId,
        );
        for await (const oldCommit of oldCommits) {
            oldCommit.handleExpiredDateOldCommittedWorkload(startDate);
        }
        return oldCommits;
    }

    async autoGeneratePlanned(
        committedWorkloads: CommittedWorkload[],
    ): Promise<void> {
        for await (const commit of committedWorkloads) {
            const plannedDomain = commit.autoGeneratePlanned();

            const plannedEntities =
                PlannedWorkloadMap.toEntities(plannedDomain);
            await this.plannedWorkloadRepo.createMany(plannedEntities);
        }
    }
}

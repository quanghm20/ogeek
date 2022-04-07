import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { WorkloadDto } from '../../../infra/dtos/workload.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { UserMap } from '../../../mappers/userMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
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
    ) {}
    async execute(
        body: CreateCommittedWorkloadDto,
        member: number,
    ): Promise<Response> {
        try {
            const userId = body.userId;
            const user = await this.userRepo.findById(userId);
            const startDate = body.startDate;
            const expiredDate = body.expiredDate;
            const userCreated = await this.userRepo.findById(member);
            const createdBy = UserMap.toEntity(userCreated);
            if (!userCreated.isPeopleOps) {
                return left(
                    new CreateCommittedWorkloadErrors.Forbidden(),
                ) as Response;
            }
            if (!user) {
                return left(
                    new CreateCommittedWorkloadErrors.NotFound(
                        userId.toString(),
                    ),
                ) as Response;
            }
            const committedWorkloads = body.committedWorkloads;
            const check = await this.checkContributed(committedWorkloads);
            if (check) {
                return left(
                    new CreateCommittedWorkloadErrors.NotFound(check),
                ) as Response;
            }
            const result = await this.committedWorkloadRepo.saveCommits(
                committedWorkloads,
                userId,
                startDate,
                expiredDate,
                createdBy.id,
            );
            if (result.length < 0) {
                return left(
                    new AppError.UnexpectedError(
                        'Internal Server Error Exception',
                    ),
                );
            }
            const committedWorkloadsDto =
                CommittedWorkloadMap.fromCommittedWorkloadShortArray(result);
            return right(Result.ok(committedWorkloadsDto));
        } catch (err) {
            return left(err);
        }
    }
    async checkContributed(committedWorkload: WorkloadDto[]): Promise<string> {
        for await (const workload of committedWorkload) {
            const contribute = await this.contributedValueRepo.findOne(
                workload.valueStreamId,
                workload.expertiseScopeId,
            );
            if (!contribute) {
                return `Cannot get value stream with id ${workload.valueStreamId} and expertise scope with id ${workload.expertiseScopeId}`;
            }
        }
        return null;
    }
}

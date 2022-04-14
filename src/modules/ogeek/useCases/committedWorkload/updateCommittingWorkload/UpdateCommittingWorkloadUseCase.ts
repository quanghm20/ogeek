import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CommittingWorkloadDto } from '../../../infra/dtos/updateCommittingWorkload/updateCommittingWorkload.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { UpdateCommittingWorkloadErrors } from './UpdateCommittingWorkloadErrors';

type Response = Either<
    | AppError.UnexpectedError
    | UpdateCommittingWorkloadErrors.UserNotFound
    | UpdateCommittingWorkloadErrors.NotFound,
    Result<CommittingWorkloadDto[]>
>;

@Injectable()
export class UpdateCommittingWorkloadUseCase
    implements IUseCase<number, Promise<Response>>
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
    async execute(userId: number, member: number): Promise<Response> {
        try {
            const user = await this.userRepo.findById(userId);
            const userUpdated = await this.userRepo.findById(member);
            // const createdBy = UserMap.toEntity(userUpdated);
            if (!user) {
                return left(
                    new UpdateCommittingWorkloadErrors.UserNotFound(userId),
                ) as Response;
            }
            if (!userUpdated) {
                return left(
                    new UpdateCommittingWorkloadErrors.UserNotFound(member),
                ) as Response;
            }
            const data = new Array<CommittingWorkloadDto>();
            return right(Result.ok(data));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

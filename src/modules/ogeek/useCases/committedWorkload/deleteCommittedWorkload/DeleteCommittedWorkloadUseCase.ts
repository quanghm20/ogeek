import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { DeleteCommittedWorkloadErrors } from './DeleteCommittedWorkloadErrors';

type Response = Either<
    AppError.UnexpectedError | DeleteCommittedWorkloadErrors.NotFound,
    Result<CommittedWorkloadShortDto>
>;

@Injectable()
export class DeleteCommittedWorkloadUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,

        private _event: EventEmitter2,
    ) {}
    async execute(idCommitment: number, member: number): Promise<Response> {
        try {
            const committedWorkload = await this.committedWorkloadRepo.findById(
                idCommitment,
            );

            if (!committedWorkload) {
                return left(
                    new DeleteCommittedWorkloadErrors.NotFound(idCommitment),
                );
            }
            const status = committedWorkload.status;
            if (committedWorkload.isComing()) {
                committedWorkload.delete(member);
                const commitmentEntity =
                    CommittedWorkloadMap.toEntity(committedWorkload);
                const result = await this.committedWorkloadRepo.save(
                    commitmentEntity,
                );
                if (!result) {
                    return left(
                        new DeleteCommittedWorkloadErrors.CanNotDelete(
                            idCommitment,
                        ),
                    );
                }
                this._event.emit(
                    'committed-workload.deleted',
                    committedWorkload,
                );
                return right(
                    Result.ok(
                        CommittedWorkloadMap.fromCommittedWorkloadShort(
                            committedWorkload,
                        ),
                    ),
                );
            }
            return left(
                new DeleteCommittedWorkloadErrors.CanNotDeleteCommitment(
                    status,
                ),
            );
        } catch (err) {
            return left(err);
        }
    }
}

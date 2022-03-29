import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { GetCommittedWorkloadErrors } from './GetCommittedWorkloadErrors';
type Response = Either<
    AppError.UnexpectedError | GetCommittedWorkloadErrors.NotFound,
    Result<CommittedWorkloadShortDto[]>
>;

@Injectable()
export class GetCommittedWorkloadUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    ) {}
    async execute(): Promise<Response> {
        try {
            const committedWorkloadsDomain =
                await this.committedWorkloadRepo.findAllActiveCommittedWorkload();
            if (committedWorkloadsDomain.length <= 0) {
                return left(new GetCommittedWorkloadErrors.NotFound());
            }
            const committedWorkloadsDto =
                CommittedWorkloadMap.fromCommittedWorkloadShortArray(
                    committedWorkloadsDomain,
                );
            return right(Result.ok(committedWorkloadsDto));
        } catch (err) {
            return left(err);
        }
    }
}

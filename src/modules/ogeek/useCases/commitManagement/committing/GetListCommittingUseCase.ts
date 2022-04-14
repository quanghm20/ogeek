import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import {
    DataListCommittingWorkload,
    FilterListCommittingWorkload,
} from '../../../infra/dtos/commitManagement/committing/committing.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { GetListCommittingErrors } from './GetListCommittingErrors';

type Response = Either<
    AppError.UnexpectedError | GetListCommittingErrors.ListCommittingNotFound,
    Result<DataListCommittingWorkload>
>;

@Injectable()
export class GetListCommittingUseCase
    implements IUseCase<FilterListCommittingWorkload, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    ) {}
    async execute(query: FilterListCommittingWorkload): Promise<Response> {
        try {
            const committedWorkloads =
                await this.committedWorkloadRepo.findListCommittingWorkload(
                    query,
                );
            if (!committedWorkloads) {
                return left(
                    new GetListCommittingErrors.ListCommittingNotFound(),
                );
            }
            return right(Result.ok(committedWorkloads));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { DataHistoryCommittedWorkload } from '../../..//infra/dtos/historyCommittedWorkload/HistoryCommittedWorkload.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { FilterCommittedWorkload } from '../FilterCommittedWorkload';
import { GetCommittedWorkloadErrors } from '../getCommittedWorkload/GetCommittedWorkloadErrors';
type Response = Either<
    AppError.UnexpectedError | GetCommittedWorkloadErrors.NotFound,
    Result<DataHistoryCommittedWorkload>
>;

@Injectable()
export class GetHistoryCommittedWorkloadUseCase
    implements IUseCase<FilterCommittedWorkload | number, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    ) {}
    async execute(query?: FilterCommittedWorkload): Promise<Response> {
        try {
            const committedWorkloadsDomain =
                await this.committedWorkloadRepo.findHistoryCommittedWorkload(
                    query,
                );

            return right(Result.ok(committedWorkloadsDomain));
        } catch (err) {
            return left(err);
        }
    }
}

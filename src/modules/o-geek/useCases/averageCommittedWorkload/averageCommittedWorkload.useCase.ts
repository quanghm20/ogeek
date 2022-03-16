// import { Inject, Injectable } from '@nestjs/common';
// import { IUseCase } from 'core/domain/UseCase';
// import { AppError } from 'core/logic/AppError';
// import { Either, left, Result, right } from 'core/logic/Result';
// import { CommittedWorkload } from 'modules/o-geek/domain/committedWorkload';
// import { DomainId } from 'modules/o-geek/domain/domainId';

// import { ICommittedWorkloadRepo } from '../../modules/o-geek/repos/committedWorkloadRepo';
// import { GetAverageCommittedWorkloadErrors } from '../overviewChartData/overviewChartData.Error';

// type Response = Either<
//     | AppError.UnexpectedError
//     | GetAverageCommittedWorkloadErrors.GetAverageCommittedWorkloadFailed,
//     Result<CommittedWorkload>
// >;

// @Injectable()
// export class GetAverageCommittedWorkloadUseCase
//     implements IUseCase<DomainId | number, Promise<Response>>
// {
//     constructor(
//         @Inject('ICommittedWorkloadRepo')
//         public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
//     ) {}

//     async execute(committedWorkloadId: DomainId | number): Promise<Response> {
//         try {
//             const committedWorkload = await this.committedWorkloadRepo.findById(
//                 committedWorkloadId,
//             );
//             if (committedWorkload) {
//                 return right(Result.ok(committedWorkload));
//             }
//             return left(
//                 new GetAverageCommittedWorkloadErrors.GetAverageCommittedWorkloadFailed(committedWorkloadId),
//             ) as Response;
//         } catch (err) {
//             return left(new AppError.UnexpectedError(err));
//         }
//     }
// }

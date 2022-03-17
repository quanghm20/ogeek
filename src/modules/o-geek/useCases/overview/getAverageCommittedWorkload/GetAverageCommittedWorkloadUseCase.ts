// /* eslint-disable prettier/prettier */
// import { Inject, Injectable } from '@nestjs/common';

// import { IUseCase } from '../../../../../core/domain/UseCase';
// import { AppError } from '../../../../../core/logic/AppError';
// import { Either, left, Result, right } from '../../../../../core/logic/Result';
// import { CommittedWorkload } from '../../../domain/committedWorkload';
// import { DomainId } from '../../../domain/domainId';
// import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
// import { IExpertiseScopeRepo } from '../../../repos/expertiseScopeRepo';
// import { GetAverageCommittedWorkloadErrors } from './GetAverageCommittedWorkloadErrors';

// type Response = Either<
//     | AppError.UnexpectedError
//     | GetAverageCommittedWorkloadErrors.NoWorkloadCommitted,
//     Result<CommittedWorkload>
// >;

// @Injectable()
// export class GetAverageCommittedWorkloadUseCase
//     implements IUseCase<DomainId | number, Promise<Response>> {
//     constructor(
//         @Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
//         @Inject('IExpertiseScope') public readonly expertiseScopeRepo: IExpertiseScopeRepo,
//     ) {}

//     async execute(committedWorkloadId: DomainId | number): Promise<Response> {
//         try {
//             const committedWorkload = await this.committedWorkloadRepo.findById(committedWorkloadId);
//             // Handle biz logic and data
//             const expertiseScope = await this.expertiseScopeRepo.findById(committedWorkloadId);
//             const expertiseScopeSet = new Set();
//             expertiseScopeSet.add(expertiseScope.name);

//             if (committedWorkload) {
//                 return right(Result.ok(committedWorkload));
//             }
//             return left(
//                 new GetAverageCommittedWorkloadErrors.NoWorkloadCommitted(
//                     committedWorkloadId,
//                 ),
//             ) as Response;
//         } catch (err) {
//             return left(new AppError.UnexpectedError(err));
//         }
//     }
// }

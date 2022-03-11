// /* eslint-disable prettier/prettier */
// import { Inject, Injectable } from '@nestjs/common';
// import { Request } from 'express';

// import { IUseCase } from '../../../../../core/domain/UseCase';
// import { AppError } from '../../../../../core/logic/AppError';
// import { Either, left, Result, right } from '../../../../../core/logic/Result';
// import { Profile } from '../../../domain/profile';
// import { ProfileId } from '../../../domain/profileId';
// import { IProfileRepo } from '../../../repos/profileRepo';

// type Response = Either<
//     AppError.UnexpectedError | GetProfileErrors.ProfileNotFound,
//     Result<Profile>
// >;

// @Injectable()
// export class GetContributedValueUseCase
//     implements IUseCase<ProfileId | string, Promise<Response>>
// {
//     constructor(
//         @Inject('IProfileRepo') public readonly profileRepo: IProfileRepo,
//     ) {}

//     async execute(profileId: ProfileId | string, request: Request): Promise<Response> {
//         try {
//             const profile = await this.profileRepo.findById(profileId);
//             if (profile) {
//                 return right(Result.ok(profile));
//             }

//             return left(
//                 new GetProfileErrors.ProfileNotFound(profileId.toString()),
//             ) as Response;
//         } catch (err) {
//             return left(new AppError.UnexpectedError(err));
//         }
//     }
// }

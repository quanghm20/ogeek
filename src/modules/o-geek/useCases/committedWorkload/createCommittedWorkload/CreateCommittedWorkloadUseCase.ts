/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
// import { UserMap } from '../../../mappers/userMap';
import { IUserRepo } from '../../../repos/userRepo';
import { CreateCommittedWorkloadErrors } from './CreateCommittedWorkloadErrors';
type Response = Either<
    AppError.UnexpectedError | CreateCommittedWorkloadErrors.NotFound,
    Result<string>
>;

@Injectable()
export class CreateCommittedWorkloadUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>> {
    constructor(
		@Inject('IUserRepo') public readonly userRepo: IUserRepo,
	) { }
    async execute(body: CreateCommittedWorkloadDto): Promise<Response> {
		try {
			const userId = body.userId;
			const user = await this.userRepo.findById(userId);
			if (!user) {
				return left(
                new CreateCommittedWorkloadErrors.NotFound( `Could not find User ${userId}` ),
				) as Response;
			}
			// const committedWorkloads = body.committedWorkloads;
			// committedWorkloads.forEach(workload){

			// }
		} catch (err) {
			return left(new AppError.UnexpectedError(err));
		}
		return right(Result.ok('Alo alo'));
	}
}

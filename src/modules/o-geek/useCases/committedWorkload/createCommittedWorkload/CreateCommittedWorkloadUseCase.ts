/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result } from '../../../../../core/logic/Result';
import { CommittedWorkload } from '../../../domain/committedWorkload';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { IUserRepo } from '../../../repos/userRepo';
import { CreateCommittedWorkloadErrors } from './CreateCommittedWorkloadErrors';

type Response = Either<
    AppError.UnexpectedError | CreateCommittedWorkloadErrors.NotFound,
    Result<CommittedWorkload>
>;

@Injectable()
export class CreateCommittedWorkloadUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>> {
    constructor(
		@Inject('IUserRepo') public readonly userRepo: IUserRepo,

	) { }
    async execute(body: CreateCommittedWorkloadDto): Promise<Response> {
		try {
			const userId = Number(body.userId);
			const user = await this.userRepo.findById(userId);
			if (!user) {
				return left(
                new CreateCommittedWorkloadErrors.NotFound( `Could not find User ${userId}` ),
				) as Response;
			}
		} catch (err) {
			return left(new AppError.UnexpectedError(err));
		}
		return left(
        new CreateCommittedWorkloadErrors.NotFound('Can not get contributed value' ),
		) as Response;
	}
}

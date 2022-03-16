/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CommittedWorkload } from '../../../domain/committedWorkload';
import { ContributedValueDto } from '../../../infra/dtos/contributedValue.dto';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { ContributedValueMap } from '../../../mappers/contributedValueMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { CreateCommittedWorkloadErrors } from './CreateCommittedWorkloadErrors';

type Response = Either<
    AppError.UnexpectedError | CreateCommittedWorkloadErrors.NotFound,
    Result<CommittedWorkload>
>;

type ResponseContributedValueDto = Either<
    AppError.UnexpectedError | CreateCommittedWorkloadErrors.NotFound,
     Result<ContributedValueDto[]>
>;
@Injectable()
export class CreateCommittedWorkloadUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>> {
    constructor(
		@Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
		@Inject('IUserRepo') public readonly userRepo: IUserRepo,
		@Inject('IContributedValueRepo') public readonly contributedValueRepo: IContributedValueRepo,

	) { }
	   async getContributedValue(): Promise<ResponseContributedValueDto> {
		try {
			const contributedValue = await this.contributedValueRepo.findAll();
			if (!contributedValue) {
				return left(
                new CreateCommittedWorkloadErrors.NotFound('Can not get contributed value' ),
				) as ResponseContributedValueDto;
			}
			const contributedValueArray = Array<ContributedValueDto>();
			contributedValue.forEach(function(contributed) {
				const contributedDto = ContributedValueMap.fromDomain(contributed);
				contributedValueArray.push(contributedDto);
			});
			return right(Result.ok(contributedValueArray));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));

		}
	}
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

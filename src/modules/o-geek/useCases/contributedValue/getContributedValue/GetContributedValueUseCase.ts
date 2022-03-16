/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ContributedValueDto } from '../../../infra/dtos/contributedValue.dto';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { ContributedValueMap } from '../../../mappers/contributedValueMap';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { GetContributedValueErrors } from './GetContributedValueErrors';

type Response = Either<
    AppError.UnexpectedError | GetContributedValueErrors.NotFound,
     Result<ContributedValueDto[]>
>;
@Injectable()
export class GetContributedValueUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>> {
    constructor(
		@Inject('IContributedValueRepo') public readonly contributedValueRepo: IContributedValueRepo,

	) { }
	   async execute(): Promise<Response> {
		try {
			const contributedValue = await this.contributedValueRepo.findAll();
			if (!contributedValue) {
				return left(
                new GetContributedValueErrors.NotFound('Can not get contributed value' ),
				) as Response;
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
}

/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { GetContributedValueShortDto } from '../../..//infra/dtos/getContributedValue/getContributedValue.dto';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { ExpertiseScopeShortDto } from '../../../infra/dtos/getContributedValue/expertiseScopeShort.dto';
import { ContributedValueMap } from '../../../mappers/contributedValueMap';
import { ValueStreamMap } from '../../../mappers/valueStreamMap';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IValueStreamRepo } from '../../../repos/valueStreamRepo';
import { GetContributedValueErrors } from './GetContributedValueErrors';

type Response = Either<
    AppError.UnexpectedError | GetContributedValueErrors.NotFound,
     Result<GetContributedValueShortDto[]>
>;
@Injectable()
export class GetContributedValueUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>> {
    constructor(
		@Inject('IContributedValueRepo') public readonly contributedValueRepo: IContributedValueRepo,
		@Inject('IValueStreamRepo') public readonly valueStreamRepo: IValueStreamRepo,

	) { }
	   async execute(): Promise<Response> {
		try {
			const contributedValue = await this.contributedValueRepo.findAll();
			if (!contributedValue) {
				return left(
                new GetContributedValueErrors.NotFound('Can not get contributed value' ),
				) as Response;
			}
			const valueStreamDomain = await this.valueStreamRepo.findAll();
			const getContributedValues = Array<GetContributedValueShortDto>();

			const contributedDto = ContributedValueMap.fromDomainShortAll(contributedValue);

			valueStreamDomain.forEach(function(value) {
				const valueStream = ValueStreamMap.fromDomainShort(value);
				const expertiseScopes = Array<ExpertiseScopeShortDto>();
				contributedDto.forEach(function(contribute) {
					if (valueStream.id === contribute.valueStream.id) {
						expertiseScopes.push(contribute.expertiseScope);
					}
				});

				const getContribute = new GetContributedValueShortDto(valueStream, expertiseScopes);
				getContributedValues.push(getContribute);
			});

			return right(Result.ok(getContributedValues));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));

		}
	}
}

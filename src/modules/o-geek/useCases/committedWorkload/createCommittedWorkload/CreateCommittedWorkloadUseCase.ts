/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../../infra/dtos/createCommittedWorkload/committedWorkloadShort.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
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
		@Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
		@Inject('IContributedValueRepo') public readonly contributedValueRepo: IContributedValueRepo,
	) { }
    async execute(body: CreateCommittedWorkloadDto): Promise<Response> {
		try {
			const userId = body.userId;
			const user = await this.userRepo.findById(userId);
			const startDate = body.startDate;
			const expiredDate = body.expiredDate;
			if (!user) {
				return left(
                new CreateCommittedWorkloadErrors.NotFound( `Could not find User ${userId}` ),
				) as Response;
			}
			const committedWorkloads = body.committedWorkloads;
			await Promise.all(committedWorkloads.map(async (workload) => {
				const contribute = await this.contributedValueRepo.findOne(workload.valueStreamId, workload.expertiseScopeId);
				if (!contribute) {
					return left(
						new CreateCommittedWorkloadErrors.NotFound(
							`Could not find ValueStream with id ${workload.valueStreamId} and ExpertiseScope ${workload.expertiseScopeId}`),
				) as Response;
				}
				const committed = new CommittedWorkloadShortDto(
					userId,
					workload.valueStreamId,
					workload.expertiseScopeId,
					workload.workload,
					startDate,
					expiredDate,
					);
				const newWorkload = await this.committedWorkloadRepo.save(committed, 2);
				if (!newWorkload) {
				return left(
						new CreateCommittedWorkloadErrors.NotFound(
							`Could not find ValueStream with id ${workload.valueStreamId} and ExpertiseScope ${workload.expertiseScopeId}`),
				) as Response;
				}
			}));

		} catch (err) {
			return left(new AppError.UnexpectedError(err));
		}
		return right(Result.ok('Alo alo'));
	}
}

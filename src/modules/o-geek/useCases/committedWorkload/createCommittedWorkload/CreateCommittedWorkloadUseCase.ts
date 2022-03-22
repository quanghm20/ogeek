/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result } from '../../../../../core/logic/Result';
import { CommittedWorkloadEntity } from '../../../infra/database/entities/committedWorkload.entity';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
// import { CommittedWorkloadShortDto } from '../../../infra/dtos/createCommittedWorkload/committedWorkloadShort.dto';
import { ContributedValueMap } from '../../../mappers/contributedValueMap';
import { UserMap } from '../../../mappers/userMap';
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
			const userEntity = UserMap.toEntity(user);
			const committedWorkloads = body.committedWorkloads;
			const committees = Array<CommittedWorkloadEntity>();

			await Promise.all(committedWorkloads.map(async (workload) => {
				const contribute = await this.contributedValueRepo.findOne(
					workload.valueStreamId,
					workload.expertiseScopeId);
				if (!contribute) {
					return left(
						new CreateCommittedWorkloadErrors.NotFound(
							`Could not find ValueStream with id ${workload.valueStreamId} and ExpertiseScope ${workload.expertiseScopeId}`),
					);
				}
				const contributedEntity = ContributedValueMap.toEntity(contribute);
				const committed = new CommittedWorkloadEntity(
					userEntity,
					contributedEntity,
					workload.workload,
					startDate,
					expiredDate,
					userEntity,
				);
				committees.push(committed);
				// 				const newWorkload = await this.committedWorkloadRepo.save(committed);
				// 				if (!newWorkload) {
				// 					return left(
				// 						new CreateCommittedWorkloadErrors.NotFound(
				// `Can't not create committed workload with ValueStream ${workload.valueStreamId} and ExpertiseScope ${workload.expertiseScopeId}`),
				// 					);
				// 				}
				// 				return right(Result.ok('Created committed workload!'));

			}));

		} catch (err) {
			return left(new AppError.UnexpectedError(err));
		}
	}
}

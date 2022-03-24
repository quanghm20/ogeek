/* eslint-disable complexity */
/* eslint-disable prettier/prettier */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { RoleType } from '../../../../../common/constants/role-type';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, right } from '../../../../../core/logic/Result';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { WorkloadDto } from '../../../infra/dtos/workload.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { CreateCommittedWorkloadErrors } from './CreateCommittedWorkloadErrors';
type Response = Either<
    AppError.UnexpectedError | CreateCommittedWorkloadErrors.NotFound,
    MessageDto
>;

@Injectable()
export class CreateCommittedWorkloadUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>> {
    constructor(
		@Inject('IUserRepo') public readonly userRepo: IUserRepo,
		@Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
		@Inject('IContributedValueRepo') public readonly contributedValueRepo: IContributedValueRepo,
	) { }
	   async execute(body: CreateCommittedWorkloadDto,
	): Promise<Response> {
			try {
				const userId = body.userId;
				const user = await this.userRepo.findById(userId);
				const startDate = body.startDate;
				const expiredDate = body.expiredDate;
				const picId = body.picId;
				if (!user) {
					return left(
						new CreateCommittedWorkloadErrors.NotFound( `Could not find User ${userId}` ),
					) as Response;
				}
				if (user.role !== RoleType.ADMIN) {
					return left(
						new CreateCommittedWorkloadErrors.Forbidden(),
					) as Response;
				}

				const committedWorkloads = body.committedWorkloads;
				const check = await this.checkContributed(committedWorkloads);
				if (check !== 'ok') {
					return left(new CreateCommittedWorkloadErrors.NotFound(check )) as Response;
				}
				const result = await this.committedWorkloadRepo.saveCommits(committedWorkloads, userId, startDate,
					expiredDate, picId);

				switch (result) {
					case HttpStatus.INTERNAL_SERVER_ERROR:
						return left(new AppError.UnexpectedError('Internal Server Error Exception'));
					case HttpStatus.CREATED:
						return right(new MessageDto(HttpStatus.CREATED, 'Created committed workload !'));
					case HttpStatus.BAD_REQUEST:
						return left(new CreateCommittedWorkloadErrors.DateError());
				}

			} catch (err) {
				return left(err);
		}
	}
	   async checkContributed(committedWorkload: WorkloadDto[]): Promise<string> {
		for await (const workload of committedWorkload) {
			const contribute = await this.contributedValueRepo.findOne(workload.valueStreamId, workload.expertiseScopeId);
			if (!contribute) {
				return `Cannot get value stream with id ${workload.valueStreamId} and expertise scope with id ${workload.expertiseScopeId}`;
			}
		}
		return 'ok';

	}

}

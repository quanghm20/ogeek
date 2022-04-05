import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { dateRange } from '../../../../../common/constants/dateRange';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { Issue } from '../../../domain/issue';
import { CreateIssueDto } from '../../../infra/dtos/createIssue/createIssue.dto';
import { IIssueRepo } from '../../../repos/issueRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { CreateIssueErrors } from './CreateIssueErrors';
type Response = Either<
    AppError.UnexpectedError | CreateIssueErrors.NotFound,
    Result<Issue>
>;

@Injectable()
export class CreateIssueUseCase
    implements IUseCase<CreateIssueDto | number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('IIssueRepo') public readonly issueRepo: IIssueRepo,
    ) {}
    async execute(createIssueDto: CreateIssueDto): Promise<Response> {
        try {
            const { userId, picId } = createIssueDto;
            const user = await this.userRepo.findById(userId);
            const pic = await this.userRepo.findById(picId);
            if (!pic && !pic.isAdmin()) {
                return left(new CreateIssueErrors.Forbidden()) as Response;
            }
            if (!user) {
                return left(
                    new CreateIssueErrors.NotFound(userId.toString()),
                ) as Response;
            }

            const { week, type } = createIssueDto;

            const dateOfWeek = moment()
                .utcOffset(dateRange.TIME_ZONE_OFFSET)
                .week(week)
                .format();
            const numDateOfWeek = moment(dateOfWeek).format('e');
            const startDateOfWeek = moment(dateOfWeek)
                .utcOffset(dateRange.TIME_ZONE_OFFSET)
                .add(-numDateOfWeek, 'days')
                .startOf('day')
                .format();
            const endDateOfWeek = moment(startDateOfWeek)
                .utcOffset(dateRange.TIME_ZONE_OFFSET)
                .add(dateRange.DURATION_BETWEEN_START_AND_END, 'days')
                .endOf('day')
                .format();

            const issue = await this.issueRepo.findByUserId(
                startDateOfWeek,
                endDateOfWeek,
                userId,
            );
            if (issue) {
                await this.issueRepo.update(
                    { week, user: { id: userId } },
                    { type },
                );
                return right(Result.ok(issue));
            }

            const result = await this.issueRepo.save(userId, week, type);
            if (result) {
                return right(Result.ok(result));
            }
            return left(new CreateIssueErrors.CreateIssueFailed()) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

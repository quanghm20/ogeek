// import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { RoleType } from '../../../../../common/constants/role-type';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, right } from '../../../../../core/logic/Result';
import { CreateIssueDto } from '../../../../o-geek/infra/dtos/createIssue/createIssue.dto';
import { IIssueRepo } from '../../../../o-geek/repos/issueRepo';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { IUserRepo } from '../../../repos/userRepo';
import { CreateIssueErrors } from './CreateIssueErrors';
type Response = Either<
    AppError.UnexpectedError | CreateIssueErrors.NotFound,
    MessageDto
>;

@Injectable()
export class CreateIssueUseCase
    implements IUseCase<CreateIssueDto | number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('IIssueRepo') public readonly issueRepo: IIssueRepo,
    ) {}
    async execute(body: CreateIssueDto): Promise<Response> {
        try {
            const userId = body.userId;
            const user = await this.userRepo.findById(userId);
            const pic = await this.userRepo.findById(body.picId);
            if (pic.role !== RoleType.ADMIN) {
                return left(new CreateIssueErrors.Forbidden()) as Response;
            }
            if (!user) {
                return left(
                    new CreateIssueErrors.NotFound(userId.toString()),
                ) as Response;
            }
            const week = body.week;
            const type = body.type;

            const dateOfWeek = moment().utcOffset(420).week(week).format();
            const numDateOfWeek = moment(dateOfWeek).format('e');
            const startDateOfWeek = moment(dateOfWeek)
                .utcOffset(420)
                .add(-numDateOfWeek, 'days')
                .startOf('day')
                .format();
            const endDateOfWeek = moment(startDateOfWeek)
                .utcOffset(420)
                .add(6, 'days')
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
                return right(
                    new MessageDto(HttpStatus.CREATED, 'Update issue !'),
                );
            }

            const result = await this.issueRepo.saveIssue(userId, week, type);
            switch (result) {
                case HttpStatus.INTERNAL_SERVER_ERROR:
                    return left(
                        new AppError.UnexpectedError(
                            'Internal Server Error Exception',
                        ),
                    );
                case HttpStatus.CREATED:
                    return right(
                        new MessageDto(
                            HttpStatus.CREATED,
                            'Update Successfully',
                        ),
                    );
            }
        } catch (err) {
            return left(err);
        }
    }
}

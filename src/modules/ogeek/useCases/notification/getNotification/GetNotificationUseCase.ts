import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { NotificationMap } from '../../../..//ogeek/mappers/notificationMap';
import { INotificationRepo } from '../../../../ogeek/repos/notificationRepo';
import { NotificationDto } from '../../../infra/dtos/notification/getNotifications/notification.dto';
import { IUserRepo } from '../../../repos/userRepo';
import { GetNotificationErrors } from './GetNotificationErrors';

type Response = Either<
    | AppError.UnexpectedError
    | GetNotificationErrors.UserNotFound
    | GetNotificationErrors.NotificationNotFound,
    Result<NotificationDto[]>
>;

@Injectable()
export class GetNotificationUseCase
    implements IUseCase<number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('INotificationRepo')
        public readonly notificationRepo: INotificationRepo,
    ) {}
    async execute(userId: number): Promise<Response> {
        try {
            const user = await this.userRepo.findById(userId);

            if (!user) {
                return left(new GetNotificationErrors.UserNotFound(userId));
            }

            const notifications = await this.notificationRepo.findByUserId(
                userId,
            );

            if (notifications.length <= 0) {
                return left(new GetNotificationErrors.NotificationNotFound());
            }

            const notificationsDto =
                NotificationMap.fromArrayDomain(notifications);
            return right(Result.ok(notificationsDto));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

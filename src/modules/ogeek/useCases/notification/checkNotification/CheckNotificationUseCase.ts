import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { NotificationMap } from '../../../..//ogeek/mappers/notificationMap';
import { CheckNotificationDto } from '../../../../ogeek/infra/dtos/notification/checkNotification/checkNotification.dto';
import { INotificationRepo } from '../../../../ogeek/repos/notificationRepo';
import { NotificationDto } from '../../../infra/dtos/notification/getNotifications/notification.dto';
import { IUserRepo } from '../../../repos/userRepo';
import { CheckNotificationErrors } from './CheckNotificationErrors';

type Response = Either<
    | AppError.UnexpectedError
    | CheckNotificationErrors.UserNotFound
    | CheckNotificationErrors.NotificationNotFound,
    Result<NotificationDto>
>;

@Injectable()
export class CheckNotificationUseCase
    implements IUseCase<CheckNotificationDto | number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('INotificationRepo')
        public readonly notificationRepo: INotificationRepo,
    ) {}
    async execute(
        body: CheckNotificationDto,
        userId: number,
    ): Promise<Response> {
        try {
            const notificationId = body.id;
            const user = await this.userRepo.findById(userId);

            if (!user) {
                return left(new CheckNotificationErrors.UserNotFound(userId));
            }

            const notification = await this.notificationRepo.findById(
                notificationId,
            );

            if (notification === null) {
                return left(
                    new CheckNotificationErrors.NotificationNotFound(
                        notificationId,
                    ),
                );
            }
            if (notification.isRead()) {
                const notificationDto =
                    NotificationMap.fromDomain(notification);
                return right(Result.ok(notificationDto));
            }
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { Notification } from '../domain/notification';
import { NotificationEntity } from '../infra/database/entities';
import { NotificationDto } from '../infra/dtos/notification/getNotifications/notification.dto';

export class NotificationMap implements Mapper<Notification> {
    public static fromDomain(notification: Notification): NotificationDto {
        const notificationDto = new NotificationDto();
        notificationDto.id = Number(notification.id);
        notificationDto.message = notification.props.message;
        notificationDto.read = notification.props.read;
        notificationDto.createdAt = notification.props.createdAt;

        return notificationDto;
    }

    public static fromArrayDomain(
        notifications: Notification[],
    ): NotificationDto[] {
        const notificationsDto = new Array<NotificationDto>();
        notifications.forEach((notification) => {
            notificationsDto.push(NotificationMap.fromDomain(notification));
        });
        return notificationsDto;
    }

    public static toDomain(raw: NotificationEntity): Notification {
        const { id } = raw;
        const notificationOrError = Notification.create(
            {
                message: raw.message,
                read: raw.read,
                createdAt: raw.createdAt,
            },
            new UniqueEntityID(id),
        );
        return notificationOrError.isSuccess
            ? notificationOrError.getValue()
            : null;
    }
    public static toEntity(notification: Notification): NotificationEntity {
        const notificationEntity = {} as NotificationEntity;
        notificationEntity.id = Number(notification.id.toValue());
        notificationEntity.message = notification.message;
        notificationEntity.read = notification.read;
        notificationEntity.createdAt = notification.createdAt;

        return notificationEntity;
    }

    public static toArrayDomain(
        notifications: NotificationEntity[],
    ): Notification[] {
        const listNotifications = new Array<Notification>();
        notifications.forEach((notification) => {
            const notificationsOrError = NotificationMap.toDomain(notification);
            if (notificationsOrError) {
                listNotifications.push(notificationsOrError);
            } else {
                return null;
            }
        });

        return listNotifications;
    }
}

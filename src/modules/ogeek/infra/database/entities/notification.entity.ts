import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { NotificationStatus } from '../../../../../common/constants/notificationStatus';
import { UserEntity } from './user.entity';

@Entity({ name: 'issue' })
export class NotificationEntity extends AbstractEntity {
    @Column({
        nullable: false,
        enum: NotificationStatus,
        default: null,
        name: 'read',
    })
    read: NotificationStatus;

    @Column({
        name: 'message',
    })
    message: string;

    @ManyToOne(() => UserEntity, (user) => user.committedWorkloads)
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'created_by',
    })
    createdBy?: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'updated_by',
    })
    updatedBy?: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'deleted_by',
    })
    deletedBy?: UserEntity;
}

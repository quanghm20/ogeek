import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { IssueStatus } from '../../../../../common/constants/issueStatus';
import { UserEntity } from './user.entity';

@Entity({ name: 'issue' })
export class IssueEntity extends AbstractEntity {
    @Column({
        enum: IssueStatus,
        name: 'type',
    })
    status: IssueStatus;

    @Column({ name: 'note' })
    note: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'created_by',
    })
    createdBy: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'updated_by',
    })
    updatedBy: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'deleted_by',
    })
    deletedBy: UserEntity;

    constructor(
        note: string,
        status: IssueStatus,
        user: UserEntity,
        createdBy?: UserEntity,
        updatedBy?: UserEntity,
        deletedBy?: UserEntity,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super();
        this.note = note;
        this.status = status;
        this.user = user;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { IssueType } from '../../../../../common/constants/issue-type';
import { UserEntity } from './user.entity';

@Entity({ name: 'issue' })
export class IssueEntity extends AbstractEntity {
    @Column({
        nullable: false,
        enum: IssueType,
        name: 'type',
        default: null,
    })
    type: IssueType;

    @Column({
        nullable: false,
        name: 'week',
    })
    week: number;

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

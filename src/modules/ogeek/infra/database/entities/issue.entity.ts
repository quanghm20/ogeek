import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { IssueStatus } from '../../../../../common/constants/issueStatus';
import { UserEntity } from './user.entity';

@Entity({ name: 'issue' })
export class IssueEntity extends AbstractEntity {
    @Column({
        nullable: false,
        enum: IssueStatus,
        name: 'type',
        default: null,
    })
    type: IssueStatus;

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

    constructor(type: IssueStatus, week: number, user: UserEntity) {
        super();
        this.type = type;
        this.week = week;
        this.user = user;
    }
}

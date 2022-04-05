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

    constructor(type: IssueType, week: number, user: UserEntity) {
        super();
        this.type = type;
        this.week = week;
        this.user = user;
    }
}

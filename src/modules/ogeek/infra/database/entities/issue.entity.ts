import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { IssueStatus } from '../../../../../common/constants/issueStatus';
import { UserEntity } from './user.entity';

@Entity({ name: 'issue' })
export class IssueEntity extends AbstractEntity {
    @Column({
        enum: IssueStatus,
        name: 'status',
    })
    status: IssueStatus;

    @Column({ name: 'note' })
    note: string;

    @Column({ name: 'date_of_week' })
    dateOfWeek: Date;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    constructor(
        id?: number,
        note?: string,
        status?: IssueStatus,
        dateOfWeek?: Date,
        user?: UserEntity,
        createdBy?: number,
        updatedBy?: number,
        deletedBy?: number,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super(id);
        this.note = note;
        this.status = status;
        this.dateOfWeek = dateOfWeek;
        this.user = user;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}

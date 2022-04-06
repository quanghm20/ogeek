import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { ContributedValueEntity } from './contributedValue.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'planned_workload' })
@Check('CHK_PLANNED_WORKLOAD', '"planned_workload" >= 0')
@Check('CHK_START_DATE_PLANNED_WORKLOAD', '"start_date" > now()')
export class PlannedWorkloadEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, (user) => user.plannedWorkloads)
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    @ManyToOne(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.plannedWorkloads,
    )
    @JoinColumn({
        name: 'contributed_value_id',
    })
    contributedValue: ContributedValueEntity;

    @ManyToOne(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.plannedWorkloads,
    )
    @JoinColumn({
        name: 'committed_workload_id',
    })
    committedWorkload: CommittedWorkloadEntity;

    @Column({
        nullable: false,
        name: 'planned_workload',
    })
    plannedWorkload: number;

    @Column({
        nullable: false,
        name: 'start_date',
        type: 'timestamp with time zone',
    })
    startDate: Date;

    @Column({
        nullable: false,
        name: 'status',
        type: 'enum',
        enum: PlannedWorkloadStatus,
        default: PlannedWorkloadStatus.PLANNING,
    })
    status: PlannedWorkloadStatus;

    @Column({
        nullable: false,
        name: 'reason',
    })
    reason: string;

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
        id?: number,
        user?: UserEntity,
        contributedValue?: ContributedValueEntity,
        committedWorkload?: CommittedWorkloadEntity,
        plannedWorkload?: number,
        startDate?: Date,
        reason?: string,
        createdBy?: UserEntity,
        updatedBy?: UserEntity,
        deletedBy?: UserEntity,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super(id);
        this.user = user;
        this.contributedValue = contributedValue;
        this.committedWorkload = committedWorkload;
        this.plannedWorkload = plannedWorkload;
        this.startDate = startDate;
        this.reason = reason;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
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
    })
    startDate: Date;

    @Column({
        nullable: false,
        name: 'status',
        type: 'enum',
        enum: PlannedWorkloadStatus,
        default: PlannedWorkloadStatus.ACTIVE,
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

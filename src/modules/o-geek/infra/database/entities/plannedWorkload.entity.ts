/* eslint-disable import/no-default-export */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { ContributedValueEntity } from './contributedValue.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'planned_workload' })
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
        default: false,
    })
    status: boolean;

    @Column({
        nullable: false,
        name: 'reason',
    })
    reason: string;
}

/* eslint-disable import/no-default-export */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { ContributedValueEntity } from './contributedValue.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'planned_workload' })
export class PlannedWorkloadEntity extends AbstractEntity {
    @Column({
        nullable: false,
        name: 'id',
    })
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.plannedWorkload)
    @JoinColumn({
        name: 'id_user',
    })
    user: UserEntity;

    @ManyToOne(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.plannedWorkloads,
    )
    @JoinColumn({
        name: 'id_contributed_value',
    })
    contributedValue: ContributedValueEntity;

    @ManyToOne(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.plannedWorkloads,
    )
    @JoinColumn({
        name: 'id_committed_workload',
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
        name: 'created_at',
    })
    createdAt: Date;

    @Column({
        nullable: false,
        name: 'updated_at',
    })
    updatedAt: Date;
}

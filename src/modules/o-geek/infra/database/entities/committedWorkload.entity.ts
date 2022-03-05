/* eslint-disable import/no-default-export */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { ContributedValueEntity } from './contributedValue.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'committed_workload' })
export class CommittedWorkloadEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, (user) => user.committedWorkloads)
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    @ManyToOne(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.committedWorkloads,
    )
    @JoinColumn({
        name: 'contributed_value_id',
    })
    contributedValue: ContributedValueEntity;

    @Column({
        nullable: false,
        name: 'committed_workload',
    })
    committedWorkload: number;

    @Column({
        nullable: false,
        name: 'start_date',
    })
    startDate: Date;

    @Column({
        nullable: false,
        name: 'expired_date',
    })
    expireDate: Date;

    @ManyToOne(() => UserEntity, (user) => user.committedWorkloads)
    @JoinColumn({
        name: 'pid',
    })
    pid: UserEntity;

    @OneToMany(
        () => PlannedWorkloadEntity,
        (plannedWorkload) => plannedWorkload.committedWorkload,
    )
    plannedWorkloads: PlannedWorkloadEntity[];
}

/* eslint-disable import/no-default-export */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { ContributedValueEntity } from './contributedValue.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'committed_workload' })
export class CommittedWorkloadEntity extends AbstractEntity {
    @Column({
        nullable: false,
        name: 'id',
    })
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'id_user',
    })
    user: UserEntity;

    @ManyToOne(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.id,
    )
    @JoinColumn({
        name: 'id_contributed_value',
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
        name: 'expire_date',
    })
    expireDate: Date;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'id_PIC',
    })
    idPIC: UserEntity;

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

    @OneToMany(
        () => PlannedWorkloadEntity,
        (plannedWorkload) => plannedWorkload.id,
    )
    plannedWorkloads: PlannedWorkloadEntity[];
}

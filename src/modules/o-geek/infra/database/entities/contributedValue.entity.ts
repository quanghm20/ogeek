/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable import/no-default-export */
// import { defaultTo } from 'lodash';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { ExpertiseScopeEntity } from './expertiseScope.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';
import { ValueStreamEntity } from './valueStream.entity';

@Entity({ name: 'contributed_value' })
export class ContributedValueEntity extends AbstractEntity {
    @Column({
        nullable: false,
        name: 'id',
    })
    id: number;

    @ManyToOne(
        () => ExpertiseScopeEntity,
        (expertiseScope) => expertiseScope.contributedValues,
    )
    @JoinColumn({
        name: 'id_expertise_scope',
    })
    expertiseScope: ExpertiseScopeEntity;

    @ManyToOne(
        () => ValueStreamEntity,
        (valueStream) => valueStream.contributedValues,
    )
    @JoinColumn({
        name: 'id_value_stream',
    })
    valueStream: ValueStreamEntity;

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

    @OneToMany(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.id,
    )
    committedWorkloads: CommittedWorkloadEntity[];
}

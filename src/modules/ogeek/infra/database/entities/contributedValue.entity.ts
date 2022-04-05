import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { ExpertiseScopeEntity } from './expertiseScope.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';
import { UserEntity } from './user.entity';
import { ValueStreamEntity } from './valueStream.entity';

@Entity({ name: 'contributed_value' })
export class ContributedValueEntity extends AbstractEntity {
    @ManyToOne(
        () => ExpertiseScopeEntity,
        (expertiseScope) => expertiseScope.contributedValues,
    )
    @JoinColumn({
        name: 'expertise_scope_id',
    })
    expertiseScope: ExpertiseScopeEntity;

    @ManyToOne(
        () => ValueStreamEntity,
        (valueStream) => valueStream.contributedValues,
    )
    @JoinColumn({
        name: 'value_stream_id',
    })
    valueStream: ValueStreamEntity;

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

    @OneToMany(
        () => PlannedWorkloadEntity,
        (plannedWorkload) => plannedWorkload.contributedValue,
    )
    plannedWorkloads: PlannedWorkloadEntity[];

    @OneToMany(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.contributedValue,
    )
    committedWorkloads: CommittedWorkloadEntity[];
}

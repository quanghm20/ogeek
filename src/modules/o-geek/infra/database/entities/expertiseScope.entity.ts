/* eslint-disable import/no-default-export */
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { ContributedValueEntity } from './contributedValue.entity';

@Entity({ name: 'expertise_scope' })
export class ExpertiseScopeEntity extends AbstractEntity {
    @Column({
        nullable: false,
        name: 'name',
    })
    name: string;

    @OneToMany(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.expertiseScope,
    )
    contributedValues: ContributedValueEntity[];
}

import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { ContributedValueEntity } from './contributedValue.entity';

@Entity({ name: 'value_stream' })
export class ValueStreamEntity extends AbstractEntity {
    @Column({
        nullable: false,
        name: 'name',
    })
    name: string;

    @OneToMany(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.valueStream,
    )
    contributedValues: ContributedValueEntity[];
}

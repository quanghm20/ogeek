import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { ContributedValueEntity } from './contributedValue.entity';

@Entity({ name: 'value_stream' })
export class ValueStreamEntity extends AbstractEntity {
    @Column({
        nullable: false,
        name: 'id',
    })
    id: number;

    @Column({
        nullable: false,
        name: 'name',
    })
    name: string;

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
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.id,
    )
    contributedValues: ContributedValueEntity[];
}

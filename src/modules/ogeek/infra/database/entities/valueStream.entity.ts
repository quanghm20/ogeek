import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { ContributedValueEntity } from './contributedValue.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'value_stream' })
export class ValueStreamEntity extends AbstractEntity {
    @Column({
        nullable: false,
        name: 'name',
    })
    name: string;

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
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.valueStream,
    )
    contributedValues: ContributedValueEntity[];
}

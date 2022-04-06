import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { ContributedValueEntity } from './contributedValue.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'expertise_scope' })
export class ExpertiseScopeEntity extends AbstractEntity {
    @Column({
        nullable: false,
        name: 'name',
    })
    name: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'created_by',
    })
    createdBy: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'updated_by',
    })
    updatedBy: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'deleted_by',
    })
    deletedBy: UserEntity;

    @OneToMany(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.expertiseScope,
    )
    contributedValues: ContributedValueEntity[];

    constructor(
        name: string,
        createdBy?: UserEntity,
        updatedBy?: UserEntity,
        deletedBy?: UserEntity,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super();
        this.name = name;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}

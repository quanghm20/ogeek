import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';

@Entity({ name: 'social_profile' })
export class ProfileEntity extends AbstractEntity {
    @Column({ nullable: false, name: 'id' })
    id: string;

    @Column({
        nullable: false,
        name: 'deleted_by',
    })
    deletedBy: string;

    @Column({
        nullable: false,
        name: 'facebook_link',
    })
    facebookLink: string;

    @Column({
        nullable: false,
        name: 'created_at',
    })
    createdAt: Date;
}

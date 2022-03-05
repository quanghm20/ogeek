import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';

@Entity({ name: 'social_profile' })
export class ProfileEntity extends AbstractEntity {
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
}

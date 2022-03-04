/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { RoleType } from '../../../../../common/constants/role-type';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';
// import { UserDto } from './dto/UserDto';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
    @Column({
        unique: true,
        nullable: false,
        name: 'alias',
    })
    alias: string;

    @Column({
        nullable: false,
        name: 'name',
    })
    name: string;

    @Column({
        unique: true,
        nullable: true,
        name: 'phone',
    })
    phone: string;

    @Column({
        unique: true,
        nullable: false,
        name: 'email',
    })
    email: string;

    @Column({
        nullable: true,
        name: 'avatar',
    })
    avatar: string;

    @Column({
        type: 'enum',
        enum: RoleType,
        default: RoleType.USER,
    })
    role: RoleType;

    // toDto(): UserDto {
    //     return new UserDto(this);
    // }

    @OneToMany(
        () => PlannedWorkloadEntity,
        (plannedWorkload) => plannedWorkload.id,
    )
    plannedWorkload: PlannedWorkloadEntity[];

    @OneToMany(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.id,
    )
    committedWorkload: CommittedWorkloadEntity[];
}

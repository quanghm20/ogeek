/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { RoleType } from '../../../../../common/constants/role-type';
import { Status } from '../../../../../common/constants/status';
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
        nullable: false,
        default: RoleType.USER,
    })
    role: RoleType;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PLANING,
        name: 'week_status',
    })
    weekStatus: Status;
    // toDto(): UserDto {
    //     return new UserDto(this);
    // }

    @OneToMany(
        () => PlannedWorkloadEntity,
        (plannedWorkload) => plannedWorkload.user,
    )
    plannedWorkloads: PlannedWorkloadEntity[];

    @OneToMany(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.user,
    )
    committedWorkloads: CommittedWorkloadEntity[];

    toDto(): UserDto {
        return new UserDto(this);
    }
}

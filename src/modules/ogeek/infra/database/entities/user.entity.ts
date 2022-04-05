import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Unique,
} from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { RoleType } from '../../../../../common/constants/roleType';
import { UserDto } from '../../dtos/user.dto';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { IssueEntity } from './issue.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';

@Entity({ name: 'user' })
@Unique('UQ_USER_ALIAS', ['alias'])
@Unique('UQ_USER_PHONE', ['phone'])
@Unique('UQ_USER_EMAIL', ['email'])
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
        (plannedWorkload) => plannedWorkload.user,
    )
    plannedWorkloads: PlannedWorkloadEntity[];

    @OneToMany(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.user,
    )
    committedWorkloads: CommittedWorkloadEntity[];

    @OneToMany(() => IssueEntity, (issue) => issue.user)
    issue: IssueEntity[];

    toDto(): UserDto {
        return new UserDto(this);
    }
}

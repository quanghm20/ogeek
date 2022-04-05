import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { RoleType } from '../../../../../common/constants/roleType';
import { WeekStatus } from '../../../../../common/constants/weekStatus';
import { UserDto } from '../../dtos/user.dto';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { IssueEntity } from './issue.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';

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
        enum: WeekStatus,
        default: WeekStatus.PLANNING,
        name: 'week_status',
    })
    weekStatus: WeekStatus;

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

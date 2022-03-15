import { ApiProperty } from '@nestjs/swagger';

import { RoleType } from '../../../../common/constants/role-type';
import { WeekStatus } from '../../../../common/constants/week-status';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { UserEntity } from '../database/entities/user.entity';
export class UserDto {
    @ApiProperty({ type: UniqueEntityID })
    id?: UniqueEntityID;

    @ApiProperty({ example: 'thai.ls' })
    alias?: string;

    @ApiProperty({ example: 'Sỹ Thái' })
    name?: string;

    @ApiProperty({ example: '0984786432' })
    phone?: string;

    @ApiProperty({ example: 'thai.ls@geekup.vn' })
    email?: string;

    @ApiProperty({ example: 'http://localhost' })
    avatar?: string;

    @ApiProperty({ example: RoleType.ADMIN })
    role?: RoleType;

    @ApiProperty({ example: WeekStatus.PLANING })
    weekStatus?: WeekStatus;

    @ApiProperty({ example: new Date() })
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;

    constructor(user: UserEntity) {
        this.alias = user.alias;
        this.id = new UniqueEntityID(user.id);
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.avatar = user.avatar;
        this.role = user.role;
        this.weekStatus = user.weekStatus;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}

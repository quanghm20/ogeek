import { ApiProperty } from '@nestjs/swagger';

import { RoleType } from '../../../../common/constants/roleType';
import { WeekStatus } from '../../../../common/constants/weekStatus';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { UserEntity } from '../database/entities/user.entity';

export class UserDto {
    @ApiProperty({
        type: () => UniqueEntityID,
        example: new UniqueEntityID(77),
    })
    id?: UniqueEntityID;

    @ApiProperty({ example: 'thai.ls' })
    alias?: string;

    @ApiProperty({ example: 'Sỹ Thái' })
    name?: string;

    @ApiProperty({ example: '0984786432' })
    phone?: string;

    @ApiProperty({ example: 'thai.ls@geekup.vn' })
    email?: string;

    @ApiProperty({ example: 'http://localhost/avatar' })
    avatar?: string;

    @ApiProperty({ enum: RoleType, example: RoleType.ADMIN })
    role?: RoleType;

    @ApiProperty({ enum: WeekStatus, example: WeekStatus.PLANNING })
    weekStatus?: WeekStatus;

    @ApiProperty({ example: new Date() })
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;

    constructor(user?: UserEntity) {
        if (user) {
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
}

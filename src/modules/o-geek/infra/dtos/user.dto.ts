import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { UserEntity } from '../database/entities/user.entity';
export class UserDto {
    @ApiProperty()
    id?: UniqueEntityID;

    @ApiProperty()
    alias?: string;

    @ApiProperty()
    name?: string;

    @ApiProperty()
    phone?: string;

    @ApiProperty()
    email?: string;

    @ApiProperty()
    avatar?: string;

    @ApiProperty()
    role?: string;

    @ApiProperty()
    weekStatus?: string;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
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

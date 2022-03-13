'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { RoleType } from '../../../../common/constants/role-type';
import { AbstractDto } from '../../../../common/dto/AbstractDto';

export class UserDto extends AbstractDto {
    @IsString()
    @ApiProperty()
    alias: string;

    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    sub: string;

    @IsString()
    @ApiProperty()
    avatar: string;

    @IsString()
    @ApiProperty()
    phone: string;

    @IsEnum(RoleType)
    @ApiProperty()
    role: RoleType;
}

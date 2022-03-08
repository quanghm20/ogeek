'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AbstractDto } from '../../../../common/dto/AbstractDto';

export class UserDto extends AbstractDto {
    @IsString()
    @ApiProperty()
    username: string;

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
}

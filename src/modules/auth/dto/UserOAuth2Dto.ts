'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserOAuth2Dto {
    @IsString()
    @ApiProperty()
    readonly alias: string;

    @IsString()
    @ApiProperty()
    readonly name: string;

    @IsString()
    @ApiProperty()
    readonly email: string;
}

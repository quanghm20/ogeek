'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthenUserDto {
    @IsString()
    @ApiProperty()
    readonly alias: string;

    constructor(data: { alias: string }) {
        this.alias = data.alias;
    }
}

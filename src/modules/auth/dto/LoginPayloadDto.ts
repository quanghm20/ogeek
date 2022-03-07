'use strict';

import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../user/dto/UserDto';
import { TokenPayloadDto } from './TokenPayloadDto';
import { UserOAuth2Dto } from './UserOAuth2Dto';

export class LoginPayloadDto {
    @ApiProperty({ type: UserDto })
    user: UserDto | UserOAuth2Dto;
    @ApiProperty({ type: TokenPayloadDto })
    token: TokenPayloadDto;

    constructor(user: UserDto | UserOAuth2Dto, token: TokenPayloadDto) {
        this.user = user;
        this.token = token;
    }
}

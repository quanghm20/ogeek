import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserDto } from '../../modules/o-geek/infra/dtos/user.dto';

@Injectable()
export class JwtAuthService {
    constructor(private _jwtService: JwtService) {}

    signJwt(user: UserDto) {
        return this._jwtService.sign({ username: user.username });
    }
}

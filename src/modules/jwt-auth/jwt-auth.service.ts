import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserDto } from '../../modules/o-geek/infra/dtos/user.dto';
import { JwtPayload } from './jwt-auth.strategy';
@Injectable()
export class JwtAuthService {
    constructor(private _jwtService: JwtService) {}

    signJwt(user: UserDto): string {
        const payload = {
            userId: user.id,
        } as JwtPayload;
        return this._jwtService.sign(payload);
    }
}

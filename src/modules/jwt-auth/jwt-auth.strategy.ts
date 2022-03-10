import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { TokenPayloadDto } from '../../modules/auth/dto/TokenPayloadDto';
import { ConfigService } from '../../shared/services/config.service';

export interface JwtPayload {
    sub: string;
    username: string;
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        function extractJwtFromCookie(req: Request) {
            let token = '';
            if (req && req.cookies) {
                const strJwtObject = req.cookies as { jwt: string };
                const objectToken = Object.create(
                    JSON.parse(strJwtObject.jwt),
                ) as TokenPayloadDto;
                token = objectToken.accessToken;
            }
            return token;
        }

        super({
            jwtFromRequest: extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
    }

    validate(payload: JwtPayload) {
        if (!payload) {
            throw new UnauthorizedException('Forbiden!!');
        }
        return { alias: payload.username };
    }
}

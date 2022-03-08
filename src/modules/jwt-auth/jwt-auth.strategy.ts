import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayloadDto } from '../../modules/auth/dto/TokenPayloadDto';
import { ConfigService } from '../../shared/services/config.service';

export interface JwtPayload {
    sub: number;
    username: string;
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        function extractJwtFromCookie(req: Request) {
            let token = null;
            if (req && req.cookies) {
                const strJwtObject = req.cookies as { jwt: string };
                const objectToken = Object.create(
                    JSON.parse(strJwtObject.jwt),
                ) as TokenPayloadDto;
                token = objectToken.accessToken;
            }
            return (
                (token as string) ||
                ExtractJwt.fromAuthHeaderAsBearerToken()(req)
            );
        }

        super({
            jwtFromRequest: extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
    }

    validate(payload: JwtPayload) {
        return { username: payload.username };
    }
}

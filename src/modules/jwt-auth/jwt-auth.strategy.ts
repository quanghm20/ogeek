import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { ConfigService } from '../../shared/services/config.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';

export interface JwtPayload {
    userID: number;
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        function extractJwtFromCookie(req: Request): string {
            try {
                let token = '';
                if (req && req.cookies) {
                    const strJwtObject = req.cookies as { jwt: string };
                    const objectToken = Object.create(
                        JSON.parse(strJwtObject.jwt),
                    ) as TokenPayloadDto;
                    token = objectToken.accessToken;
                }
                return token;
            } catch (error) {
                throw new UnauthorizedException('Forbiden!!');
            }
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
        return payload;
    }
}

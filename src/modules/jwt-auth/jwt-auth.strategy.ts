import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../../shared/services/config.service';

export interface JwtPayload {
    userID: number;
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        function extractJwtFromCookie(req: Request): string {
            try {
                return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
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

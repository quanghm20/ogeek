import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';

import { ConfigService } from '../../shared/services/config.service';

type VoidFunction = (error: Error, isValidated: boolean) => void;

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
    Strategy,
    'api-key',
) {
    constructor(public readonly configService: ConfigService) {
        super({ header: 'X-API-KEY', prefix: '' }, true, (apiKey, done) =>
            this.validate(apiKey, done),
        );
    }
    public validate(apiKey: string, done: VoidFunction): void {
        const myApiKey = this.configService.get('API_KEY');
        if (myApiKey === apiKey) {
            done(null, true);
        }
        done(new UnauthorizedException(), null);
    }
}
import { HttpModule, Module } from '@nestjs/common';

import { JwtAuthModule } from '../../modules/jwt-auth/jwt-auth.module';
import { OGeekModule } from '../../modules/o-geek/o-geek.module';
import { OauthController } from './oauth.controller';
import { OAuthStrategy } from './oauth.strategy';

@Module({
    imports: [
        OGeekModule,
        JwtAuthModule,
        HttpModule.registerAsync({
            useFactory: () => ({
                timeout: 5000,
                maxRedirects: 5,
            }),
        }),
    ],
    controllers: [OauthController],
    providers: [OAuthStrategy],
})
export class OauthModule {}

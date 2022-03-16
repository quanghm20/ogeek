import { HttpModule, Module } from '@nestjs/common';

import { JwtAuthModule } from '../../modules/jwt-auth/jwt-auth.module';
import { OGeekModule } from '../../modules/o-geek/o-geek.module';
import { CreateUserUseCase } from '../../modules/o-geek/useCases/user/createUser/CreateUserUseCase';
import { GetUserUseCase } from '../o-geek/useCases/user/GetUser/GetUserUseCase';
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
    providers: [OAuthStrategy, CreateUserUseCase, GetUserUseCase],
})
export class OauthModule {}

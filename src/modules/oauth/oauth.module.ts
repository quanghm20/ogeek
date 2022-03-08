import { HttpModule, Module } from '@nestjs/common';

import { JwtAuthModule } from '../../modules/jwt-auth/jwt-auth.module';
import { UserRepository } from '../../modules/o-geek/repos';
import { CreateUserUseCase } from '../../modules/o-geek/useCases/user/createUser/CreateUserUseCase';
import { FindUserByAlias } from '../../modules/o-geek/useCases/user/findUserByAlias/findUserByAlias';
import { OauthController } from './oauth.controller';
import { OAuthStrategy } from './oauth.strategy';

@Module({
    imports: [
        JwtAuthModule,
        HttpModule.registerAsync({
            useFactory: () => ({
                timeout: 5000,
                maxRedirects: 5,
            }),
        }),
        UserRepository,
    ],
    controllers: [OauthController],
    providers: [
        OAuthStrategy,
        CreateUserUseCase,
        FindUserByAlias,
        UserRepository,
    ],
})
export class OauthModule {}

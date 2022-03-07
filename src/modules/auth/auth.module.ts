import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SenteService } from '../../shared/services/sente.service';
import { UserModule } from '../user/user.module';
// import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { OauthController } from './oauth.controller';
import { OAuthStrategy } from './oauth.strategy';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        HttpModule,
        SenteService,
    ],
    controllers: [OauthController],
    providers: [AuthService, JwtStrategy, OAuthStrategy],
    exports: [PassportModule.register({ defaultStrategy: 'jwt' }), AuthService],
})
export class AuthModule {}

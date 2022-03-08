import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserRepository } from '../../modules/o-geek/repos';
import { CreateUserUseCase } from '../../modules/o-geek/useCases/user/createUser/CreateUserUseCase';
import { SenteService } from '../../shared/services/sente.service';
import { UserModule } from '../user/user.module';
// import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        HttpModule,
        SenteService,
    ],
    controllers: [],
    providers: [AuthService, CreateUserUseCase, UserRepository],
    exports: [PassportModule.register({ defaultStrategy: 'jwt' }), AuthService],
})
export class AuthModule {}

import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileEntity } from './infra/database/entities/profile.entity';
import { UserEntity } from './infra/database/entities/user.entity';
import { ProfileRepository, UserRepository } from './repos/index';
import {
    GetProfileController,
    GetProfileUseCase,
} from './useCases/social/getProfile';
import { CreateUserUseCase } from './useCases/user/createUser/CreateUserUseCase';
import { GetUserByAliasController } from './useCases/user/GetUserByAlias/GetUserByAliasController';
import { GetUserByAliasUseCase } from './useCases/user/GetUserByAlias/GetUserByAliasUseCase';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([UserEntity, ProfileEntity]),
    ],
    controllers: [GetProfileController, GetUserByAliasController],
    providers: [
        {
            provide: 'IProfileRepo',
            useClass: ProfileRepository,
        },
        UserRepository,
        GetProfileUseCase,
        CreateUserUseCase,
        GetUserByAliasUseCase,
    ],
    exports: [
        CreateUserUseCase,
        GetProfileUseCase,
        GetUserByAliasUseCase,
        TypeOrmModule,
        UserRepository,
    ],
})
export class OGeekModule {}

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
import { GetUserController } from './useCases/user/GetUser/GetUserController';
import { GetUserUseCase } from './useCases/user/GetUser/GetUserUseCase';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([UserEntity, ProfileEntity]),
    ],
    controllers: [GetProfileController, GetUserController],
    providers: [
        {
            provide: 'IProfileRepo',
            useClass: ProfileRepository,
        },
        UserRepository,
        GetProfileUseCase,
        CreateUserUseCase,
        GetUserUseCase,
    ],
    exports: [
        CreateUserUseCase,
        GetProfileUseCase,
        GetUserUseCase,
        TypeOrmModule,
        UserRepository,
    ],
})
export class OGeekModule {}

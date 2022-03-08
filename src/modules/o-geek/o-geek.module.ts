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
import { FindUserByAlias } from './useCases/user/findUserByAlias/findUserByAlias';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([ProfileEntity, UserEntity]),
    ],
    controllers: [GetProfileController],
    providers: [
        GetProfileUseCase,
        CreateUserUseCase,
        FindUserByAlias,
        {
            provide: 'IProfileRepo',
            useClass: ProfileRepository,
        },
        UserRepository,
    ],
    exports: [CreateUserUseCase, UserRepository, FindUserByAlias],
})
export class OGeekModule {}

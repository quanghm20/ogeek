import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './infra/database/entities/user.entity';
import { UserRepository } from './repos/index';
import { CreateUserUseCase } from './useCases/user/createUser/CreateUserUseCase';
import { GetUserController } from './useCases/user/GetUser/GetUserController';
import { GetUserUseCase } from './useCases/user/GetUser/GetUserUseCase';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([UserEntity])],
    controllers: [GetUserController],
    providers: [UserRepository, CreateUserUseCase, GetUserUseCase],
    exports: [CreateUserUseCase, GetUserUseCase, TypeOrmModule, UserRepository],
})
export class OGeekModule {}

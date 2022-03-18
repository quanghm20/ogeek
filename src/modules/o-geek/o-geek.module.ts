import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommittedWorkloadEntity } from './infra/database/entities/committedWorkload.entity';
import { PlannedWorkloadEntity } from './infra/database/entities/plannedWorkload.entity';
import { UserEntity } from './infra/database/entities/user.entity';
import { ValueStreamEntity } from './infra/database/entities/valueStream.entity';
import {
    CommittedWorkloadRepository,
    PlannedWorkloadRepository,
    UserRepository,
    ValueStreamRepository,
} from './repos/index';
import { CreateUserUseCase } from './useCases/user/createUser/CreateUserUseCase';
import { GetUserController } from './useCases/user/getUser/GetUserController';
import { GetUserUseCase } from './useCases/user/getUser/GetUserUseCase';
import { GetValueStreamController } from './useCases/valueStream/getValueStream/GetValueStreamController';
import { GetValueStreamUseCase } from './useCases/valueStream/getValueStream/GetValueStreamUseCase';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([
            UserEntity,
            ValueStreamEntity,
            CommittedWorkloadEntity,
            PlannedWorkloadEntity,
        ]),
    ],
    controllers: [GetUserController, GetValueStreamController],
    providers: [
        UserRepository,
        ValueStreamRepository,
        CommittedWorkloadRepository,
        PlannedWorkloadRepository,
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
    ],
    exports: [
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        TypeOrmModule,
        PlannedWorkloadRepository,
        CommittedWorkloadRepository,
        UserRepository,
        ValueStreamRepository,
    ],
})
export class OGeekModule {}

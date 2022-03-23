import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommittedWorkloadEntity } from './infra/database/entities/committedWorkload.entity';
import { ContributedValueEntity } from './infra/database/entities/contributedValue.entity';
import { ExpertiseScopeEntity } from './infra/database/entities/expertiseScope.entity';
import { PlannedWorkloadEntity } from './infra/database/entities/plannedWorkload.entity';
import { UserEntity } from './infra/database/entities/user.entity';
import { ValueStreamEntity } from './infra/database/entities/valueStream.entity';
import {
    CommittedWorkloadRepository,
    ContributedValueRepository,
    ExpertiseScopeRepository,
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
            CommittedWorkloadEntity,
            ContributedValueEntity,
            ExpertiseScopeEntity,
            ValueStreamEntity,
            PlannedWorkloadEntity,
        ]),
    ],
    controllers: [GetUserController, GetValueStreamController],
    providers: [
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        {
            provide: 'IUserRepo',
            useClass: UserRepository,
        },
        {
            provide: 'IContributedValueRepo',
            useClass: ContributedValueRepository,
        },
        {
            provide: 'ICommittedWorkloadRepo',
            useClass: CommittedWorkloadRepository,
        },
        {
            provide: 'IExpertiseScopeRepo',
            useClass: ExpertiseScopeRepository,
        },
        {
            provide: 'IPlannedWorkloadRepo',
            useClass: PlannedWorkloadRepository,
        },
        {
            provide: 'IUserRepo',
            useClass: UserRepository,
        },
        {
            provide: 'IValueStreamRepo',
            useClass: ValueStreamRepository,
        },
    ],
    exports: [
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        TypeOrmModule,
    ],
})
export class OGeekModule {}

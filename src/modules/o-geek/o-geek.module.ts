import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommittedWorkloadEntity } from './infra/database/entities/committedWorkload.entity';
import { ContributedValueEntity } from './infra/database/entities/contributedValue.entity';
import { ExpertiseScopeEntity } from './infra/database/entities/expertiseScope.entity';
import { IssueEntity } from './infra/database/entities/issue.entity';
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
import { IssueRepository } from './repos/issueRepo';
import { CreateUserUseCase } from './useCases/user/createUser/CreateUserUseCase';
import { GetUserController } from './useCases/user/getUser/GetUserController';
import { GetUserUseCase } from './useCases/user/getUser/GetUserUseCase';
import { GetWorkloadListController } from './useCases/user/getWorkloadList/GetWorkloadListController';
import { GetWorkloadListUseCase } from './useCases/user/getWorkloadList/GetWorkloadListUseCase';
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
            IssueEntity,
        ]),
    ],
    controllers: [
        GetUserController,
        GetValueStreamController,
        GetWorkloadListController,
    ],
    providers: [
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        GetWorkloadListUseCase,
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
        {
            provide: 'IIssueRepo',
            useClass: IssueRepository,
        },
    ],
    exports: [
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        GetWorkloadListUseCase,
        TypeOrmModule,
    ],
})
export class OGeekModule {}

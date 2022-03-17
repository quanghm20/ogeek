import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    CommittedWorkloadEntity,
    ContributedValueEntity,
    ExpertiseScopeEntity,
    PlannedWorkloadEntity,
    ProfileEntity,
    UserEntity,
    ValueStreamEntity,
} from './infra/database/entities';
import {
    CommittedWorkloadRepository,
    ContributedValueRepository,
    ExpertiseScopeRepository,
    PlannedWorkloadRepository,
    UserRepository,
    ValueStreamRepository,
} from './repos';
import { PlanWorkloadController } from './useCases/plannedWorkload/planWorkload';
import { CreateUserUseCase } from './useCases/user/createUser/CreateUserUseCase';
import { GetUserController } from './useCases/user/GetUser/GetUserController';
import { GetUserUseCase } from './useCases/user/GetUser/GetUserUseCase';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([
            UserEntity,
            CommittedWorkloadEntity,
            ContributedValueEntity,
            ExpertiseScopeEntity,
            PlannedWorkloadEntity,
            ProfileEntity,
            ValueStreamEntity,
        ]),
    ],
    controllers: [GetUserController, PlanWorkloadController],
    providers: [
        {
            provide: 'IUserRepo',
            useClass: UserRepository,
        },
        {
            provide: 'ICommittedWorkloadRepo',
            useClass: CommittedWorkloadRepository,
        },
        {
            provide: 'IContributedValueRepo',
            useClass: ContributedValueRepository,
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
            provide: 'IValueStreamRepo',
            useClass: ValueStreamRepository,
        },
        CreateUserUseCase,
        GetUserUseCase,
    ],
    exports: [CreateUserUseCase, GetUserUseCase, TypeOrmModule, UserRepository],
})
export class OGeekModule {}

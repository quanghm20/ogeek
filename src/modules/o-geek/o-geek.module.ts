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
} from './repos/index';
import { GetAverageActualWorkloadController } from './useCases/overview/getAverageActualWorkload/GetAverageActualWorkloadController';
import { GetAverageActualWorkloadUseCase } from './useCases/overview/getAverageActualWorkload/GetAverageActualWorkloadUseCase';
import { GetWeekStatusController } from './useCases/overview/message/GetWeekStatusController';
import { GetWeekStatusUseCase } from './useCases/overview/message/GetWeekStatusUseCase';
import { OverviewChartDataController } from './useCases/overview/overviewChartData/OverviewChartDataController';
import { GetOverviewChartDataUseCase } from './useCases/overview/overviewChartData/OverviewChartDataUseCase';
import { GetOverviewSummaryYearController } from './useCases/overview/summary-year/GetOverviewSummaryYearController';
import { GetOverviewSummaryYearUseCase } from './useCases/overview/summary-year/GetOverviewSummaryYearUseCase';
import {
    PlanWorkloadController,
    PlanWorkloadUseCase,
} from './useCases/plannedWorkload/planWorkload';
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
            PlannedWorkloadEntity,
            ProfileEntity,
            ValueStreamEntity,
        ]),
    ],
    controllers: [
        GetUserController,
        GetValueStreamController,
        GetWeekStatusController,
        OverviewChartDataController,
        GetAverageActualWorkloadController,
        GetOverviewSummaryYearController,
        GetValueStreamController,
        PlanWorkloadController,
    ],
    providers: [
        CreateUserUseCase,
        GetUserUseCase,
        PlanWorkloadUseCase,
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        GetWeekStatusUseCase,
        GetOverviewChartDataUseCase,
        GetAverageActualWorkloadUseCase,
        {
            provide: 'IUserRepo',
            useClass: UserRepository,
        },
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
        UserRepository,
        {
            provide: 'IValueStreamRepo',
            useClass: ValueStreamRepository,
        },
        GetUserUseCase,
        CreateUserUseCase,
        GetOverviewSummaryYearUseCase,
    ],
    exports: [
        UserRepository,
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        TypeOrmModule,
    ],
})
export class OGeekModule {}

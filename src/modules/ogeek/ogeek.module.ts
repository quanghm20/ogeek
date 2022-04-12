import { HttpModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    CommittedWorkloadEntity,
    ContributedValueEntity,
    ExpertiseScopeEntity,
    IssueEntity,
    PlannedWorkloadEntity,
    UserEntity,
    ValueStreamEntity,
} from './infra/database/entities';
import {
    CommittedWorkloadRepository,
    ContributedValueRepository,
    ExpertiseScopeRepository,
    IssueRepository,
    PlannedWorkloadRepository,
    UserRepository,
    ValueStreamRepository,
} from './repos/index';
import {
    CommittedWorkloadController,
    CreateCommittedWorkloadUseCase,
    GetCommittedWorkloadUseCase,
    GetHistoryCommittedWorkloadUseCase,
} from './useCases/committedWorkload';
import { CronCommittedWorkload } from './useCases/committedWorkload/cronCommittedWorkload.service';
import { CommittedWorkloadCreatedListener } from './useCases/committedWorkload/listeners/CommittedWorkloadListeners';
import { UpdateCommittedWorkloadUseCase } from './useCases/committedWorkload/updateCommittedWorkload/UpdateCommittedWorkloadUseCase';
import {
    GetContributedValueController,
    GetContributedValueUseCase,
} from './useCases/contributedValue/getContributedValue';
import {
    GetDetailActualPlannedWorkloadController,
    GetDetailActualPlannedWorkloadUseCase,
} from './useCases/detailActualPlannedWorkload/getDetailActualPlannedWorkload';
import { GetAverageActualWorkloadController } from './useCases/overview/getAverageActualWorkload/GetAverageActualWorkloadController';
import { GetAverageActualWorkloadUseCase } from './useCases/overview/getAverageActualWorkload/GetAverageActualWorkloadUseCase';
import { OverviewChartDataController } from './useCases/overview/overviewChartData/GetOverviewChartDataController';
import { GetOverviewChartDataUseCase } from './useCases/overview/overviewChartData/GetOverviewChartDataUseCase';
import { GetOverviewSummaryYearController } from './useCases/overview/overviewSummaryYear/GetOverviewSummaryYearController';
import { GetOverviewSummaryYearUseCase } from './useCases/overview/overviewSummaryYear/GetOverviewSummaryYearUseCase';
import {
    PlanWorkloadController,
    PlanWorkloadUseCase,
} from './useCases/plannedWorkload/planWorkload';
import {
    ReviewRetroController,
    ReviewRetroUseCase,
} from './useCases/plannedWorkload/reviewRetro';
import {
    StartWeekController,
    StartWeekUseCase,
} from './useCases/plannedWorkload/startWeek';
import { CreateIssueController } from './useCases/user/createIssue/CreateIssueController';
import { CreateIssueUseCase } from './useCases/user/createIssue/CreateIssueUseCase';
import { CreateUserController } from './useCases/user/createUser/CreateUserController';
import { CreateUserUseCase } from './useCases/user/createUser/CreateUserUseCase';
import { GetUserController } from './useCases/user/getUser/GetUserController';
import { GetUserUseCase } from './useCases/user/getUser/GetUserUseCase';
import { GetUsersController } from './useCases/user/getUsers/GetUsersController';
import { GetUsersUseCase } from './useCases/user/getUsers/GetUsersUseCase';
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
            PlannedWorkloadEntity,
            IssueEntity,
            ValueStreamEntity,
        ]),
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
    ],
    controllers: [
        CommittedWorkloadController,
        GetContributedValueController,
        GetUserController,
        GetValueStreamController,
        OverviewChartDataController,
        GetAverageActualWorkloadController,
        GetOverviewSummaryYearController,
        GetValueStreamController,
        GetUsersController,
        PlanWorkloadController,
        GetDetailActualPlannedWorkloadController,
        GetWorkloadListController,
        CreateIssueController,
        StartWeekController,
        CreateUserController,
        ReviewRetroController,
    ],
    providers: [
        CreateUserUseCase,
        CreateCommittedWorkloadUseCase,
        GetAverageActualWorkloadUseCase,
        GetContributedValueUseCase,
        GetOverviewSummaryYearUseCase,
        GetOverviewChartDataUseCase,
        GetUserUseCase,
        PlanWorkloadUseCase,
        StartWeekUseCase,
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        GetWorkloadListUseCase,
        GetUsersUseCase,
        GetDetailActualPlannedWorkloadUseCase,
        CreateIssueUseCase,
        GetCommittedWorkloadUseCase,
        GetHistoryCommittedWorkloadUseCase,
        ReviewRetroUseCase,
        CronCommittedWorkload,
        CommittedWorkloadCreatedListener,
        UpdateCommittedWorkloadUseCase,
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
        {
            provide: 'IIssueRepo',
            useClass: IssueRepository,
        },
    ],
    exports: [
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        GetDetailActualPlannedWorkloadUseCase,
        GetWorkloadListUseCase,
        CreateIssueUseCase,
        TypeOrmModule,
        CronCommittedWorkload,
    ],
})
export class OGeekModule {}

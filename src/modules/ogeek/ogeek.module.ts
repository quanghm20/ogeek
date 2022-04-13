import { HttpModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    CommittedWorkloadEntity,
    ContributedValueEntity,
    ExpertiseScopeEntity,
    IssueEntity,
    NotificationEntity,
    PlannedWorkloadEntity,
    UserEntity,
    ValueStreamEntity,
} from './infra/database/entities';
import {
    CommittedWorkloadRepository,
    ContributedValueRepository,
    ExpertiseScopeRepository,
    IssueRepository,
    NotificationRepository,
    PlannedWorkloadRepository,
    UserRepository,
    ValueStreamRepository,
} from './repos/index';
import {
    CommittedWorkloadController,
    CreateCommittedWorkloadUseCase,
    GetCommittedWorkloadUseCase,
    GetHistoryCommittedWorkloadUseCase,
    UpdateCommittedWorkloadUseCase,
} from './useCases/committedWorkload';
import { CronCommittedWorkload } from './useCases/committedWorkload/cronCommittedWorkload.service';
import { CommittedWorkloadCreatedListener } from './useCases/committedWorkload/listeners/CommittedWorkloadListeners';
import {
    GetContributedValueController,
    GetContributedValueUseCase,
} from './useCases/contributedValue/getContributedValue';
import {
    GetDetailActualPlannedWorkloadController,
    GetDetailActualPlannedWorkloadUseCase,
} from './useCases/detailActualPlannedWorkload/getDetailActualPlannedWorkload';
import { CheckNotificationController } from './useCases/notification/checkNotification/CheckNotificationController';
import { CheckNotificationUseCase } from './useCases/notification/checkNotification/CheckNotificationUseCase';
import { GetNotificationController } from './useCases/notification/getNotification/GetNotificationController';
import { GetNotificationUseCase } from './useCases/notification/getNotification/GetNotificationUseCase';
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
import { CreatePotentialIssueController } from './useCases/potentialIssue/createPotentialIssue/CreatePotentialIssueController';
import { CreatePotentialIssueUseCase } from './useCases/potentialIssue/createPotentialIssue/CreatePotentialIssueUseCase';
import { GetPotentialIssueController } from './useCases/potentialIssue/getPotentialIssue/GetPotentialIssueController';
import { GetPotentialIssueUseCase } from './useCases/potentialIssue/getPotentialIssue/GetPotentialIssueUseCases';
import {
    GetPotentialIssuesController,
    GetPotentialIssuesUseCase,
} from './useCases/potentialIssue/getPotentialIssuesHistory';
import { UpdatePotentialIssueController } from './useCases/potentialIssue/updatePotentialIssue/UpdatePotentialIssueController';
import { UpdatePotentialIssueUseCase } from './useCases/potentialIssue/updatePotentialIssue/UpdatePotentialIssueUseCase';
import { CreateUserController } from './useCases/user/createUser/CreateUserController';
import { CreateUserUseCase } from './useCases/user/createUser/CreateUserUseCase';
import { GetUserController } from './useCases/user/getUser/GetUserController';
import { GetUserUseCase } from './useCases/user/getUser/GetUserUseCase';
import { GetUsersController } from './useCases/user/getUsers/GetUsersController';
import { GetUsersUseCase } from './useCases/user/getUsers/GetUsersUseCase';
import { GetWorkloadListController } from './useCases/user/getWorkloadList/GetWorkloadListController';
import { GetWorkloadListUseCase } from './useCases/user/getWorkloadList/GetWorkloadListUseCase';
import { GetWorkloadListsController } from './useCases/user/getWorkloadLists/GetWorkloadListsController';
import { GetWorkloadListsUseCase } from './useCases/user/getWorkloadLists/GetWorkloadListsUseCase';
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
            NotificationEntity,
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
        CreatePotentialIssueController,
        StartWeekController,
        GetPotentialIssueController,
        GetWorkloadListsController,
        GetNotificationController,
        CheckNotificationController,
        CreateUserController,
        ReviewRetroController,
        GetPotentialIssuesController,
        UpdatePotentialIssueController,
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
        CreatePotentialIssueUseCase,
        GetCommittedWorkloadUseCase,
        GetHistoryCommittedWorkloadUseCase,
        GetNotificationUseCase,
        CheckNotificationUseCase,
        ReviewRetroUseCase,
        CronCommittedWorkload,
        GetPotentialIssueUseCase,
        CommittedWorkloadCreatedListener,
        UpdatePotentialIssueUseCase,
        GetWorkloadListsUseCase,
        UpdateCommittedWorkloadUseCase,
        GetPotentialIssuesUseCase,
        CommittedWorkloadCreatedListener,
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
        {
            provide: 'INotificationRepo',
            useClass: NotificationRepository,
        },
    ],
    exports: [
        CreateUserUseCase,
        GetUserUseCase,
        GetValueStreamUseCase,
        GetDetailActualPlannedWorkloadUseCase,
        GetWorkloadListUseCase,
        TypeOrmModule,
        CronCommittedWorkload,
    ],
})
export class OGeekModule {}

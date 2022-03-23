// /* eslint-disable prettier/prettier */
// import { Inject, Injectable, Response } from '@nestjs/common';
// import Axios from 'axios';
// import { ExpertiseScopeRepository, PlannedWorkloadRepository } from 'modules/o-geek/repos';
// import * as moment from 'moment';

// import { IUseCase } from '../../../../../core/domain/UseCase';
// import { AppError } from '../../../../../core/logic/AppError';
// import { Either, left, Result, right } from '../../../../../core/logic/Result';
// import { DomainId } from '../../../domain/domainId';
// import { User } from '../../../domain/user';
// import { ActualWorkloadDto } from '../../../infra/dtos/OverviewChartDto/actualWorkload.dto';
// import { InputGetOverviewChartDataDto } from '../../../infra/dtos/OverviewChartDto/inputGetOverviewChartData.dto';
// import { OverviewChartDataDto } from '../../../infra/dtos/OverviewChartDto/overviewChartData.dto';
// import { WorkloadOverviewDto } from '../../../infra/dtos/OverviewChartDto/workloadOverview.dto';
// import { ExpertiseScopeMap } from '../../../mappers/expertiseScopeMap';
// import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
// import { IUserRepo } from '../../../repos/userRepo';
// import { MomentService } from '../../moment/configMomentService/ConfigMomentService';
// import { GetOverviewChartDataErrors } from './OverviewChartDataErrors';

// type Response = Either<
//     AppError.UnexpectedError | GetOverviewChartDataErrors.GetOverviewChartDataFailed,
//     Result<User>
// >;

// interface ServerResponse {
//     worklogData: ActualWorkloadDto[];
// }

// @Injectable()
// export class GetOverviewChartDataUseCase implements IUseCase<{ userId: number; week: number }, Promise<Response>> {
//     constructor(@Inject('IUserRepo')
//     public readonly userRepo: IUserRepo,
//                 public readonly expertiseScopeRepo: ExpertiseScopeRepository,
//                 public readonly plannedWorkloadRepo: PlannedWorkloadRepository,
//     ) {}

//     async execute(userId: DomainId | number, week: number): Promise<Response> {
//         try {
//             const url = `${process.env.MOCK_URL}/api/overview/planned-workload?userid=${userId}&week=${week}`;
//             const request = await Axios.get<ServerResponse>(url, {
//                 headers: {
//                     'x-api-key': process.env.MOCK_API_KEY,
//                 },
//             });

//             const startDateInWeek = new Date(MomentService.firstDateOfWeek(week));

//             const user = await this.userRepo.findById(userId);
//             const expertiseScopes = await this.expertiseScopeRepo.findByIdWithTimeRange({
// userId,
// startDateInWeek } as InputGetOverviewChartDataDto);
//             const plannedWorkloads = await this.plannedWorkloadRepo.findByIdWithTimeRange({
//                 userId,
//                 startDateInWeek,
//             } as InputGetOverviewChartDataDto);

//             // fetch data of workload from database and push to dto
//             const plannedWorkloadDtos = PlannedWorkloadMap.fromDomainAll(plannedWorkloads);

//             const mockUrl = 'https://mock.o-geek.geekup.io/api/';
//             const responseFromMockServer = await fetch (mockUrl, {
//                 method: 'GET',
//                 headers: {
//                     'x-api-key': 'API_KEY_EXAMPLE',
//                 },
//             });
//             console.log(responseFromMockServer);

//             const newWorkloadData = new Array<WorkloadOverviewDto>();
//             plannedWorkloadDtos.forEach((plannedWLs) => {
//                 newWorkloadData.push({
//                     plannedWorkload: plannedWLs.plannedWorkload,
//                     // actualworkload
//                     week: moment(plannedWLs.startDate).week(),
//                 } as WorkloadOverviewDto,
//                 );
//             });

//             const newOverviewChartDtos = new Array<OverviewChartDataDto>();

//             const expertiseScopeDtos = ExpertiseScopeMap.fromDomainAll(expertiseScopes);
//             expertiseScopeDtos.forEach((exScopes) => {
//                 newWorkloadData.forEach((workloads) => {
//                     newOverviewChartDtos.push({
//                         expertiseScopes: {
//                             plannedWorkload: workloads.plannedWorkload,
//                             actualWorkload: workloads.actualWorkload,
//                             week: workloads.week,
//                         },
//                         expertiseScope: exScopes.name,

//                     });
//                 }),
//                 // newOverviewChartDtos.push(
//                 //     {
//                 //     }
//                 // );
//             });

//             const returnedData = new OverviewChartDataDto();
//             newOverviewChartDtos.push(returnedData);

//             if (newOverviewChartDtos) {
//                 return right(Result.ok(returnedData));
//             }
//             return left(
//                 new GetOverviewChartDataErrors.GetOverviewChartDataFailed(userId),
//             ) as Response;

//         } catch (err) {
//             return left(new AppError.UnexpectedError(err));
//         }
//     }
// }

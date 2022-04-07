/* eslint-disable prettier/prettier */
import { Inject, Injectable, Response } from '@nestjs/common';
import Axios from 'axios';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { InputGetOverviewChartDto } from '../../../infra/dtos/overviewChart/inputGetOverviewChart.dto';
import { OverviewChartDataDto } from '../../../infra/dtos/overviewChart/overviewChartData.dto';
import { WorkloadOverviewDto } from '../../../infra/dtos/overviewChart/workloadOverview.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { ExpertiseScopeMap } from '../../../mappers/expertiseScopeMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IExpertiseScopeRepo } from '../../../repos/expertiseScopeRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetOverviewChartDataErrors } from './GetOverviewChartDataErrors';

type Response = Either<
    AppError.UnexpectedError | GetOverviewChartDataErrors.GetOverviewChartDataFailed,
    Result<OverviewChartDataDto[]>
>;

interface ServerResponse {
    data: OverviewChartDataDto[];
}

@Injectable()
export class GetOverviewChartDataUseCase implements IUseCase<InputGetOverviewChartDto, Promise<Response>> {
    constructor(
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,

        @Inject('IExpertiseScopeRepo')
        public readonly expertiseScopeRepo: IExpertiseScopeRepo,

        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,

        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    ) { }

    async execute(input: InputGetOverviewChartDto): Promise<Response> {
        try {
            // get date week
            const user = await this.userRepo.findById(input.userId);

            const startDateInWeek = new Date(MomentService.firstDateOfWeek(input.week));
            const startWeekChart = MomentService.shiftFirstWeekChart(user.createdAt);
            const endWeekChart = MomentService.shiftLastWeekChart(startWeekChart);
            // get data from database
            const expertiseScopes = await this.expertiseScopeRepo.findAll();

            const plannedWorkloads = await this.plannedWorkloadRepo.findByIdWithTimeRange(input.userId, startDateInWeek);
            const committedWorkloads = await this.committedWorkloadRepo.findByUserIdInTimeRange(input.userId, startDateInWeek);
            // fetch data of workload from database and push to dto
            const plannedWorkloadDtos = PlannedWorkloadMap.fromDomainAll(plannedWorkloads);
            const committedWorkloadDtos = CommittedWorkloadMap.fromDomainAll(committedWorkloads);
            const expertiseScopeDtos = ExpertiseScopeMap.fromDomainAll(expertiseScopes);
            const overviewChartDataDtos = new Array<OverviewChartDataDto>();
            expertiseScopeDtos.forEach((expertiseScope) => {
                const id = Number(expertiseScope.id.toString());

                const contributedValue = Array<WorkloadOverviewDto>();
                for (const plannedWorkloadDto of plannedWorkloadDtos) {

                    const week = moment(plannedWorkloadDto.startDate).week();
                    const exId = Number(plannedWorkloadDto.contributedValue?.expertiseScope?.id?.toString());
                    if (exId === id) {
                        contributedValue.push({
                            week,
                            plannedWorkload: plannedWorkloadDto.plannedWorkload,
                            actualWorkload: 0,
                        } as WorkloadOverviewDto);
                    }
                }
                if (contributedValue.length !== 0) {
                    overviewChartDataDtos.push({
                        expertiseScopes: contributedValue,
                        expertiseScope: expertiseScope.name,
                        expertiseScopeId: Number(expertiseScope.id),
                        worklogLength: input.week - moment(user.createdAt).week() >= 12
                        || input.week - moment(user.createdAt).week() < 0 ?
                                        12 : input.week - moment(user.createdAt).week(),
                        actualPlannedWorkloadLength: 18 - (input.week - moment(user.createdAt).week() >= 12
                        || input.week - moment(user.createdAt).week() < 0 ?
                                        12 : input.week - moment(user.createdAt).week()),
                    } as OverviewChartDataDto);
                }
            });
            committedWorkloadDtos.forEach(committedWL => {
                if (!overviewChartDataDtos.find(item => item.expertiseScopeId === Number(committedWL.contributedValue.expertiseScope.id.toString())))
                    {overviewChartDataDtos.push({
                        expertiseScopes: [],
                        expertiseScope: committedWL.contributedValue?.expertiseScope?.name,
                        expertiseScopeId: Number(committedWL.contributedValue?.expertiseScope?.id),
                        worklogLength: 0,
                        actualPlannedWorkloadLength: 18,
                    } as OverviewChartDataDto); }
            });

            overviewChartDataDtos.forEach(overviewChartDataDto => {
                for (let week = startWeekChart; week <= endWeekChart; week++) {
                    if (!overviewChartDataDto.expertiseScopes.find(item => item.week === week)) {
                        overviewChartDataDto.expertiseScopes.push({
                            week,
                            plannedWorkload: committedWorkloadDtos.find(
                                committedWorkloadDto =>
                                    Number(committedWorkloadDto.contributedValue.expertiseScope.id.toString())
                                    ===
                                    overviewChartDataDto.expertiseScopeId).committedWorkload,
                            actualWorkload: 0,
                        });
                    }
                }
                overviewChartDataDto.expertiseScopes.sort((a, b) => a.week - b.week);
            });
            const url = `${process.env.MOCK_URL}/api/overview/actual-workload?userId=${input.userId.toString()}`;
            const request = await Axios.post<ServerResponse>(url, overviewChartDataDtos, {
                headers: {
                    'x-api-key': process.env.MOCK_API_KEY,
                },
            });
            const worklogs = request.data.data;
            if (overviewChartDataDtos) {
                return right(Result.ok(worklogs));
            }
            return left(
                new GetOverviewChartDataErrors.GetOverviewChartDataFailed(input.userId),
            ) as Response;

        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

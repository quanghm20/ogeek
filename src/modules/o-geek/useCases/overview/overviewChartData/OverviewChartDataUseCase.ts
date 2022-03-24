/* eslint-disable prettier/prettier */
import { Inject, Injectable, Response } from '@nestjs/common';
import Axios from 'axios';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { DataWorklogDto } from '../../../infra/dtos/OverviewChartDto/dataWorklogForChart.dto';
import { InputGetOverviewChartDto } from '../../../infra/dtos/OverviewChartDto/inputGetOverviewChart.dto';
import { OverviewChartDataDto } from '../../../infra/dtos/OverviewChartDto/overviewChartData.dto';
import { WorkloadOverviewDto } from '../../../infra/dtos/OverviewChartDto/workloadOverview.dto';
import { ExpertiseScopeMap } from '../../../mappers/expertiseScopeMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { IExpertiseScopeRepo } from '../../../repos/expertiseScopeRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { MomentService } from '../../moment/configMomentService/ConfigMomentService';
import { GetOverviewChartDataErrors } from './OverviewChartDataErrors';

type Response = Either<
    AppError.UnexpectedError | GetOverviewChartDataErrors.GetOverviewChartDataFailed,
    Result<OverviewChartDataDto[]>
>;

interface ServerResponse {
    data: DataWorklogDto[];
}

@Injectable()
export class GetOverviewChartDataUseCase implements IUseCase< InputGetOverviewChartDto, Promise<Response>> {
    constructor(
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,

        @Inject('IExpertiseScopeRepo')
        public readonly expertiseScopeRepo: IExpertiseScopeRepo,

        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
    ) {}

    async execute(input: InputGetOverviewChartDto): Promise<Response> {
        try {
            // console.log(input.week);
            const url = `https://mock.o-geek.geekup.io/api/overview/actual-workload?userId=${input.userId.toString()}&week=${input.week}`;
            const request = await Axios.get<ServerResponse>(url, {
                headers: {
                    'x-api-key': process.env.MOCK_API_KEY,
                },
            });
            const worklogs = request.data.data;
            const startDateInWeek = new Date(MomentService.firstDateOfWeek(input.week));

            const expertiseScopes = await this.expertiseScopeRepo.findAll();
            const plannedWorkloads = await this.plannedWorkloadRepo.findByIdWithTimeRange(input.userId, startDateInWeek);

            // fetch data of workload from database and push to dto
            const plannedWorkloadDtos = PlannedWorkloadMap.fromDomainAll(plannedWorkloads);

            const expertiseScopeDtos = ExpertiseScopeMap.fromDomainAll(expertiseScopes);
            const overviewChartDataDtos = new Array<OverviewChartDataDto>();
            expertiseScopeDtos.forEach((expertiseScope) => {
                const id = Number(expertiseScope.id.toString());

                const contributedValue = Array<WorkloadOverviewDto>();
                for (const plannedWorkloadDto of plannedWorkloadDtos) {
                    const week = moment(plannedWorkloadDto.startDate).week();

                    const foundWorklog = worklogs.find(worklog =>
                        worklog.week === week).expertiseScopes;
                    const exId = Number(plannedWorkloadDto.contributedValue.expertiseScope.id.toString());
                    const name = plannedWorkloadDto.contributedValue.expertiseScope.name;

                    if (exId === id) {
                        const actualWorkLog = foundWorklog.find(actualWL =>
                               name === actualWL.expertiseScope);

                        contributedValue.push({
                            week,
                            plannedWorkload: plannedWorkloadDto.plannedWorkload,
                            actualWorkload: actualWorkLog ? actualWorkLog.worklog : 0,
                        } as WorkloadOverviewDto);
                    }
                }
                if (contributedValue.length !== 0) {overviewChartDataDtos.push({
                    expertiseScopes: contributedValue,
                    expertiseScope: expertiseScope.name,
                } as OverviewChartDataDto); }
            });

            if (overviewChartDataDtos) {
                return right(Result.ok(overviewChartDataDtos));
            }
            return left(
                new GetOverviewChartDataErrors.GetOverviewChartDataFailed(input.userId),
            ) as Response;

        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

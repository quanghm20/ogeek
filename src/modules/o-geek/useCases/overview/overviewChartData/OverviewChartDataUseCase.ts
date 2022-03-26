/* eslint-disable prettier/prettier */
import { Inject, Injectable, Response } from '@nestjs/common';
import Axios from 'axios';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
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
    ) { }

    async execute(input: InputGetOverviewChartDto): Promise<Response> {
        try {
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
                    const exId = Number(plannedWorkloadDto.contributedValue.expertiseScope.id.toString());
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
                    } as OverviewChartDataDto);
                }
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

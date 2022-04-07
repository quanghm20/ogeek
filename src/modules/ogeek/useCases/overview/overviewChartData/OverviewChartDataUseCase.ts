import { Inject, Injectable, Response } from '@nestjs/common';
import Axios from 'axios';

import { MAXVIEWCHARTLENGTH } from '../../../../../common/constants/chart';
import { ASSIGNNUMBER } from '../../../../../common/constants/number';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
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
import { MomentService } from '../../moment/configMomentService/ConfigMomentService';
import { GetOverviewChartDataErrors } from './OverviewChartDataErrors';

type Response = Either<
    | AppError.UnexpectedError
    | GetOverviewChartDataErrors.GetOverviewChartDataFailed,
    Result<OverviewChartDataDto[]>
>;

interface ServerResponse {
    data: OverviewChartDataDto[];
}

@Injectable()
export class GetOverviewChartDataUseCase
    implements IUseCase<InputGetOverviewChartDto, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,

        @Inject('IExpertiseScopeRepo')
        public readonly expertiseScopeRepo: IExpertiseScopeRepo,

        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,

        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    ) {}

    isBetweenWeek(week: number, plannedDate: Date): boolean {
        const startDateOfWeek = new Date(MomentService.firstDateOfWeek(week));
        const endDateOfWeek = new Date(MomentService.lastDateOfWeek(week));
        if (plannedDate >= startDateOfWeek && plannedDate <= endDateOfWeek) {
            return true;
        }
        return false;
    }

    async execute(input: InputGetOverviewChartDto): Promise<Response> {
        try {
            // get date week
            const user = await this.userRepo.findById(input.userId);

            const startWeekChart = MomentService.shiftFirstWeekChart(
                user.createdAt,
            );
            const endWeekChart =
                MomentService.shiftLastWeekChart(startWeekChart);
            const startDate = new Date(
                MomentService.firstDateOfWeek(input.week),
            );
            const endDate = new Date(
                MomentService.lastDateOfWeek(endWeekChart),
            );
            const weekChartArray = [...Array(MAXVIEWCHARTLENGTH).keys()].map(
                (item) => item + startWeekChart,
            );
            // get data from database
            const expertiseScopes = await this.expertiseScopeRepo.findAll();

            const plannedWorkloads =
                await this.plannedWorkloadRepo.findByIdWithTimeRange(
                    input.userId,
                    startDate,
                    endDate,
                );
            const committedWorkloads =
                await this.committedWorkloadRepo.findByUserIdInTimeRange(
                    input.userId,
                    startDate,
                );
            // fetch data of workload from database and push to dto
            const plannedWorkloadDtos =
                PlannedWorkloadMap.fromDomainAll(plannedWorkloads);
            const committedWorkloadDtos =
                CommittedWorkloadMap.fromDomainAll(committedWorkloads);
            const expertiseScopeDtos =
                ExpertiseScopeMap.fromDomainAll(expertiseScopes);
            const overviewChartDataDtos = new Array<OverviewChartDataDto>();

            expertiseScopeDtos.forEach((expertiseScope) => {
                const id = Number(expertiseScope.id.toString());
                let myPlannedLength = 0;
                const myCommittedWorkload = committedWorkloadDtos.find(
                    (item) =>
                        Number(
                            item.contributedValue.expertiseScope.id.toString(),
                        ) === id,
                );
                if (myCommittedWorkload) {
                    const contributedValue = Array<WorkloadOverviewDto>();
                    weekChartArray.forEach((week) => {
                        const plannedBetWeenWeek = plannedWorkloadDtos.find(
                            (plannedWl) =>
                                this.isBetweenWeek(week, plannedWl.startDate) &&
                                plannedWl.committedWorkload.id.toString() ===
                                    myCommittedWorkload.id.toString(),
                        );
                        if (plannedBetWeenWeek) {
                            contributedValue.push({
                                week,
                                plannedWorkload:
                                    plannedBetWeenWeek.plannedWorkload,
                                actualWorkload: ASSIGNNUMBER,
                            } as WorkloadOverviewDto);

                            myPlannedLength++;
                        } else {
                            contributedValue.push({
                                week,
                                plannedWorkload:
                                    myCommittedWorkload.committedWorkload,
                                actualWorkload: ASSIGNNUMBER,
                            } as WorkloadOverviewDto);
                        }
                    });
                    overviewChartDataDtos.push({
                        expertiseScopes: contributedValue,
                        expertiseScope: expertiseScope.name,
                        expertiseScopeId: id,
                        worklogLength: MAXVIEWCHARTLENGTH - myPlannedLength,
                        actualPlannedWorkloadLength: myPlannedLength,
                    } as OverviewChartDataDto);
                }
            });

            const url = `${
                process.env.MOCK_URL
            }/api/overview/actual-workload?userId=${input.userId.toString()}`;
            const request = await Axios.post<ServerResponse>(
                url,
                overviewChartDataDtos.sort(),
                {
                    headers: {
                        'x-api-key': process.env.MOCK_API_KEY,
                    },
                },
            );
            const worklogs = request.data.data;
            if (overviewChartDataDtos) {
                return right(Result.ok(worklogs));
            }
            return left(
                new GetOverviewChartDataErrors.GetOverviewChartDataFailed(
                    input.userId,
                ),
            ) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

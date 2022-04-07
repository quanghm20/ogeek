/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { dateRange } from '../../../../../common/constants/dateRange';
import { DefaultValue } from '../../../../../common/constants/defaultValue';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { SenteService } from '../../../../../shared/services/sente.service';
import { DomainId } from '../../../domain/domainId';
import { PlannedWorkload } from '../../../domain/plannedWorkload';
import { DataResponseDto } from '../../../infra/dtos/overviewSummaryYear/dataResponse.dto';
import { ExpertiseScopeDto } from '../../../infra/dtos/overviewSummaryYear/expertiseScope.dto';
import { ExpertiseScopeShortDto } from '../../../infra/dtos/overviewSummaryYear/expertiseScopeShort.dto';
import { ValueStreamsDto } from '../../../infra/dtos/overviewSummaryYear/valueStreams.dto';
import { ValueStreamShortDto } from '../../../infra/dtos/overviewSummaryYear/valueStreamShort.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IValueStreamRepo } from '../../../repos/valueStreamRepo';
import { GetOverviewSummaryYearErrors } from './GetOverviewSummaryYearErrors';

type Response = Either<
    AppError.UnexpectedError | GetOverviewSummaryYearErrors.NotFound,
    Result<DataResponseDto>
>;

@Injectable()
export class GetOverviewSummaryYearUseCase
    implements IUseCase<DomainId | number, Promise<Response>> {
    constructor(
        @Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
        @Inject('IPlannedWorkloadRepo') public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
        @Inject('IValueStreamRepo') public readonly valueStreamRepo: IValueStreamRepo,
        public readonly senteService: SenteService,
    ) { }

    async execute(userId: DomainId | number): Promise<Response> {
        try {

            const startDateYear = moment().startOf('year').format('YYYY-MM-DD');
            const startDateOfYear = moment(startDateYear, 'YYYY-MM-DD').startOf('week').format('YYYY-MM-DD');

            const endDateOfYear = moment(startDateOfYear, 'YYYY-MM-DD').add(dateRange.DAY_OF_YEAR, 'days').format('YYYY-MM-DD');

            const committedWorkloads = await this.committedWorkloadRepo.findByUserIdOverview(userId);
            const plannedWorkloads = await this.plannedWorkloadRepo.findByUserIdOverview(userId, startDateOfYear, endDateOfYear);

            const valueStream = await this.valueStreamRepo.findAllOverview();

            const data = new Array<ValueStreamsDto>();
            valueStream.map((valueStreamItem) => {
                const expertiseScopeArray = new Array<ExpertiseScopeDto>();
                committedWorkloads.map((committedWorkloadItem) => {
                    if (committedWorkloadItem.getValueStreamId() === valueStreamItem.id.toValue()) {

                        const committedWorkload =
                            committedWorkloadItem.calculate(startDateOfYear, endDateOfYear, Number(valueStreamItem.id.toValue()));

                        const plannedWorkload = PlannedWorkload.calculate(plannedWorkloads, committedWorkloadItem);

                        const expertiseScopeShort = new ExpertiseScopeShortDto(
                            committedWorkloadItem.getExpertiseScopeId(),
                            committedWorkloadItem.contributedValue.expertiseScope.name,
                        );

                        const expertiseScope = new ExpertiseScopeDto(
                            expertiseScopeShort,
                            committedWorkload,
                            plannedWorkload,
                            DefaultValue.ACTUAL_PLANNED_WORKLOAD,
                            DefaultValue.WORKLOG,
                        );
                        const findExp = expertiseScopeArray.find((expertiseScopeItem) =>
                            expertiseScope.expertiseScope.id === expertiseScopeItem.expertiseScope.id);
                        if (!findExp) {
                            expertiseScopeArray.push(expertiseScope);
                        } else {
                            const pos = expertiseScopeArray.indexOf(findExp);
                            expertiseScopeArray[pos].committedWorkload += expertiseScope.committedWorkload;
                            expertiseScopeArray[pos].plannedWorkload += expertiseScope.plannedWorkload;
                        }
                    }
                });
                const valueStreamShortDto = new ValueStreamShortDto(
                    Number(valueStreamItem.id),
                    valueStreamItem.name,
                );
                const valueStreamDto = new ValueStreamsDto(
                    valueStreamShortDto,
                    expertiseScopeArray,
                    );
                data.push(valueStreamDto);
            });

            // get actual plans and worklogs
            // const url = `${process.env.MOCK_URL}/api/overview/summary-year?userId=${userId.toString()}`;
            // const request = await Axios.post<ValueStreamsDto[]>(url, data, {
            //     headers: {
            //         'x-api-key': process.env.MOCK_API_KEY,
            //     },
            // });
            const request =
                await this.senteService.getOverviewSumaryYearWorkload<ValueStreamsDto[]>(data, userId.toString());
            const response = request.data;
            const dataResponse = new DataResponseDto(response, true);

            if (dataResponse) {
                return right(Result.ok(dataResponse));
            }

            return left(
                    new GetOverviewSummaryYearErrors.NotFound(),
                ) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

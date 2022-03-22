/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
// import { ExpertiseScopeDto } from 'modules/o-geek/infra/dtos/expertiseScope.dto';
import * as moment from 'moment';

// import { Date } from '../../../../../common/constants/date';
// import { forEach } from 'lodash';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
// import { CommittedWorkload } from '../../../domain/committedWorkload';
import { DomainId } from '../../../domain/domainId';
// import { PlannedWorkload } from '../../../domain/plannedWorkload';
// import { CommittedWorkloadDto } from '../../../infra/dtos/committedWorkload.dto';
// import { PlannedWorkloadDto } from '../../../infra/dtos/plannedWorkload.dto';
import { ExpertiseScopesDto } from '../../../infra/dtos/summaryYearDTO/expertiseScopes.dto';
import { ExpertiseScopeShortDto } from '../../../infra/dtos/summaryYearDTO/expertiseScopeShort.dto';
import { ValueStreamsDto } from '../../../infra/dtos/summaryYearDTO/valueStreams.dto';
// import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
// import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { ValueStreamMap } from '../../../mappers/valueStreamMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IValueStreamRepo } from '../../../repos/valueStreamRepo';
import { GetOverviewSummaryYearErrors } from './GetOverviewSummaryYearErrors';

type Response = Either<
    AppError.UnexpectedError | GetOverviewSummaryYearErrors.UserNotFound,
    Result<ValueStreamsDto[]>
>;

@Injectable()
export class GetOverviewSummaryYearUseCase
    implements IUseCase<DomainId | number, Promise<Response>> {
    constructor(
        @Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
        @Inject('IPlannedWorkloadRepo') public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
        @Inject('IValueStreamRepo') public readonly valueStreamRepo: IValueStreamRepo,
    ) {}

    async execute(userId: DomainId | number): Promise<Response> {
        try {
            // eslint-disable-next-line import/namespace
            moment.updateLocale('en', {
                week: {
                    dow: 6, // Saturday is the first day of the week.
                    doy: 1, // The week that contains Jan 1st is the first week of the year.
                },
            });
            const startDateYear = moment().startOf('year').format('YYYY-MM-DD');
            const startDateOfYear = moment(startDateYear, 'YYYY-MM-DD').startOf('week').format('YYYY-MM-DD');
            const endDateOfYear = moment(startDateOfYear, 'YYYY-MM-DD').add(363, 'days').format('YYYY-MM-DD');

            // array domain committedWorkload
            const committedWorkloads = await this.committedWorkloadRepo.findByUserId(userId);
            // array domain plannedWorkload
            // const plannedWorkloads = await this.plannedWorkloadRepo.findByUserId(userId);

            // array domain valueStream
            const valueStream = await this.valueStreamRepo.findAll();
            const valueStreamShortArrayDto = ValueStreamMap.fromArrayDomain(valueStream);
            // console.log(valueStreamShortArrayDto);
            const data = Array<ValueStreamsDto>();
            valueStreamShortArrayDto.forEach(function(valueStreamItem) {
                const expertiseScopesDto = Array<ExpertiseScopesDto>();
                committedWorkloads.forEach(function(committedWorkloadItem) {
                    if (committedWorkloadItem.getValueStreamId() === valueStreamItem.id) {
                        const committedWorkload = committedWorkloadItem.calculateCommittedWorkload(startDateOfYear, endDateOfYear);
                        const expertiseScopeShortDto = new ExpertiseScopeShortDto(
                            committedWorkloadItem.getExpertiseScopeId(),
                            committedWorkloadItem.contributedValue.expertiseScope.name,
                        );
                        const expertiseScope = new ExpertiseScopesDto(
                            expertiseScopeShortDto,
                            committedWorkload,
                            0,
                            0,
                            0,
                            );
                        // console.log(expertiseScopesDto);
                        if (expertiseScopesDto.length !== 0) {
                            expertiseScopesDto.every(function(expertiseScopeItem, index) {
                                if (expertiseScope.expertiseScope.id === expertiseScopeItem.expertiseScope.id) {
                                expertiseScopeItem.committedWorkload += expertiseScope.committedWorkload;
                                return;
                            }
                                expertiseScopesDto.push(expertiseScope);
                                if (index === expertiseScopesDto.length - 1) {
                                    expertiseScopesDto.push(expertiseScope);
                                }
                            });
                        } else {
                            expertiseScopesDto.push(expertiseScope);
                        }
                    }
                });
                const valueStreamDto = new ValueStreamsDto(
                    valueStreamItem,
                    expertiseScopesDto,
                    );
                data.push(valueStreamDto);
                });
            // console.log(data);

            // const url = `https://mock.o-geek.geekup.io/api/overview/summary-year?userId=${userId}`;
            // const response = await fetch(url, {  });
            // });
            if (data) {
                return right(Result.ok(data));
            }

            return left(
                    new GetOverviewSummaryYearErrors.UserNotFound(userId.toString()),
                ) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

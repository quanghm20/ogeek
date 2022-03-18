/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
// import { ExpertiseScopeDto } from 'modules/o-geek/infra/dtos/expertiseScope.dto';
import moment from 'moment';

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
        moment.updateLocale('en', {
            week: {
                dow: 6, // Saturday is the first day of the week.
                doy: 1, // The week that contains Jan 1st is the first week of the year.
            },
        });
        const startDateYear = moment().startOf('year').format('DD-MM-YYYY');
        const startDateOfYear = moment(startDateYear, 'DD-MM-YYYY').startOf('week').toDate();
        const endDateOfYear = moment(startDateOfYear, 'DD-MM-YYYY').add(363, 'days').toDate();
        try {

            // array domain committedWorkload
            const committedWorkloads = await this.committedWorkloadRepo.findByUserId(userId);
            // array domain plannedWorkload

            // array domain valueStream
            const valueStream = await this.valueStreamRepo.findAll();
            const valueStreamShortArrayDto = ValueStreamMap.fromArrayDomain(valueStream);
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
                        expertiseScopesDto.push(expertiseScope);
                    }
                });
                const valueStreamDto = new ValueStreamsDto(
                    valueStreamItem,
                    expertiseScopesDto,
                );
                data.push(valueStreamDto);
            });
            // console.log(data);

            // const plannedWorkloadArrayDTO = Array<PlannedWorkloadDto>();
            // plannedWorkloads.forEach(function(plannedWorkloadItem) {
            //         const plannedWorkloadItemDTO = PlannedWorkloadMap.fromDomain(plannedWorkloadItem);
            //         plannedWorkloadArrayDTO.push(plannedWorkloadItemDTO);
            //     });

                // startDate and endDate of year

            // const overviewSummaryYearArrayDTO = Array<ValueStreamsDto>();
            // committedWorkloadArrayDTO.forEach(function(committedWorkloadItem) {
            //         plannedWorkloadArrayDTO.forEach(function(plannedWorkloadItem) {
            //             if (committedWorkloadItem.contributedValue.id === plannedWorkloadItem.contributedValue.id) {
            //                 // const startDate = committedWorkloadItem.startDate.getUTCDate();
            //                 // const ex = new ExpertiseScopesDto();
            //             }
            //         });
                    // const url = `https://mock.o-geek.geekup.io/api/overview/summary-year?userId=${userId}`;
                    // const response = await fetch(url );
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

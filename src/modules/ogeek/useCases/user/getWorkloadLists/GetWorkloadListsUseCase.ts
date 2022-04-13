/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { historyWorkloads } from '../../../../../common/constants/history';
import { Order } from '../../../../../common/constants/order';
import { RoleType } from '../../../../../common/constants/roleType';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { PaginationService } from '../../../../../shared/services/pagination.service';
import { SenteService } from '../../../../../shared/services/sente.service';
import {
    PaginationDto,
    PaginationResponseDto,
} from '../../../infra/dtos/pagination.dto';
import { HistoryActualWLResponse } from '../../../infra/dtos/workloadListUsers/historyActualWLResponse.dto';
// import { HistoryWorkloadDto, HistoryWorkloadUseCaseDto } from '../../../infra/dtos/workloadListUsers/historyWorkload.dto';
import { HistoryWorkloadResponseDto } from '../../../infra/dtos/workloadListUsers/historyWorkloadResponses.dto';
import { IUserRepo } from '../../../repos/userRepo';
import { GetWorkloadListsError } from './GetWorkloadListsErrors';

type Response = Either<
    AppError.UnexpectedError | GetWorkloadListsError.WorkloadListNotFound,
    Result<HistoryWorkloadResponseDto>
>;

interface ServerResponse {
    data: HistoryActualWLResponse[];
}

interface IHashUserWorkloads {
    [key: string]: any;
}

@Injectable()
export class GetWorkloadListsUseCase
    implements IUseCase<PaginationDto, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,
        public readonly senteService: SenteService,
    ) {}

    async execute(query: PaginationDto, userId: number): Promise<Response> {
        try {
            const user = await this.userRepo.findById(userId);

            if (user.role !== RoleType.PP) {
                return left(new GetWorkloadListsError.Forbidden()) as Response;
            }

            const request =
                await this.senteService.getOverviewHistoryActualWorkload<ServerResponse>();
            const response = request.data.data;

            const allowSortColumnArray = [
                'alias',
                'id',
                'note',
                'status',
                'committed',
            ];

            const sortDefault = {
                status: Order.ASC,
            };

            const pagination = PaginationService.pagination(
                query,
                allowSortColumnArray,
                sortDefault,
            );

            const week = MomentService.getCurrentWeek();
            const firstDateOfThreeWeekAgo = MomentService.firstDateOfWeek(
                week - historyWorkloads.WORKLOAD_IN_THREE_WEEK,
            );
            const endDateOfCurrentWeek = MomentService.lastDateOfWeek(week);

            const listUserWorkloads = await this.userRepo.findListUserWorkload(
                pagination,
                firstDateOfThreeWeekAgo,
                endDateOfCurrentWeek,
                query.q,
            );

            // const hashMap: IHashUserWorkloads = {};

            // const actualWorkloads = [];

            // for (let i = 1; i <= historyWorkloads.WORKLOAD_IN_THREE_WEEK; i++) {
            //     actualWorkloads.push({
            //         week: week - i,
            //         status: null,
            //     });
            // }

            // handle duplicate user
            // listUserWorkloads.forEach((userWorkload) => {
            //     if (!hashMap[userWorkload.userId]) {
            //         const actualWorkloadsTemp = actualWorkloads;
            //         if (userWorkload.status) {
            //             actualWorkloadsTemp.forEach(actual => {
            //                 if (actual.week === userWorkload.) {
            //                     actual.status = userWorkload.status;
            //                 }
            //             })
            //         }
            //             hashMap[userWorkload.userId] = {
            //                 ...userWorkload,
            //                 actualWorkloads: actualWorkloadsTemp,
            //             };
            //         return;
            //     }

            //     hashMap[userWorkload.userId].actualWorkloads.forEach((actual) => {
            //         if (actual.week === userWorkload.) {
            //             actual.status = userWorkload.status;
            //         }
            //     };
            // });

            // const hashMapArray = Object.values(hashMap) as HistoryWorkloadUseCaseDto[];

            const listUserWorkloadData = listUserWorkloads;

            const userWorkloads = listUserWorkloadData.map((workloadItem) => {
                for (const res of response) {
                    if (workloadItem.userId === res.userId) {
                        return {
                            ...workloadItem,
                            committed: Number(workloadItem.committed),
                            actualWorkloads: res.actualWorkloads.map(
                                (actual) => ({
                                    ...actual,
                                    week: week + actual.week,
                                }),
                            ),
                        };
                    }
                }
            });

            const itemCount = 20;

            const paginationResponse = new PaginationResponseDto(
                query.page,
                pagination.limit,
                itemCount,
            );

            const userWorkloadsResponse = {
                meta: paginationResponse,
                data: userWorkloads,
            } as HistoryWorkloadResponseDto;

            if (!userWorkloadsResponse) {
                return left(
                    new GetWorkloadListsError.WorkloadListNotFound(),
                ) as Response;
            }
            return right(Result.ok(userWorkloadsResponse));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

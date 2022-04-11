/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { Order } from '../../../../../common/constants/order';
import { RoleType } from '../../../../../common/constants/roleType';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { PaginationService } from '../../../../../shared/services/pagination.service';
import { SenteService } from '../../../../../shared/services/sente.service';
import { PaginationDto } from '../../../infra/dtos/pagination.dto';
import { HistoryActualWLResponse } from '../../../infra/dtos/workloadListUsers/historyActualWLResponse.dto';
import { HistoryWorkloadDto } from '../../../infra/dtos/workloadListUsers/historyWorkload.dto';
import { IUserRepo } from '../../../repos/userRepo';
import { GetWorkloadListsError } from './GetWorkloadListsErrors';

type Response = Either<
    AppError.UnexpectedError | GetWorkloadListsError.WorkloadListNotFound,
    Result<HistoryWorkloadDto[]>
>;

interface ServerResponse {
    data: HistoryActualWLResponse[];
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
                'user.alias',
                'user.id',
                'user.avatar',
                'issue.note',
                'issue.status',
                'committed_workload',
            ];

            const sortDefault = {
                'issue.status': Order.ASC,
            };

            const pagination = PaginationService.pagination(
                query,
                allowSortColumnArray,
                sortDefault,
            );

            const week = MomentService.getCurrentWeek();
            const firstDateOfThreeWeekAgo = MomentService.firstDateOfWeek(
                week - 3,
            );
            const endDateOfCurrentWeek = MomentService.lastDateOfWeek(week);

            const listUserWorkloads = await this.userRepo.findListUserWorkload(
                pagination,
                firstDateOfThreeWeekAgo,
                endDateOfCurrentWeek,
            );

            const userWorkloads = listUserWorkloads.map((workloadItem) => {
                for (const res of response) {
                    if (workloadItem.userId === res.userId) {
                        return {
                            ...workloadItem,
                            // committedWorkload: workloadItem,
                            actualWorkloads: res.actualWorkloads,
                        };
                    }
                }
            });

            if (!userWorkloads) {
                return left(
                    new GetWorkloadListsError.WorkloadListNotFound(),
                ) as Response;
            }
            return right(Result.ok(userWorkloads));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

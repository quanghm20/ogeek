/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { AverageActualWorkloadDto } from '../../../infra/dtos/GetAverageActualWorkload/averageActualWorkload.dto';
import { InputGetAverageActualWorkloadDto } from '../../../infra/dtos/GetAverageActualWorkload/inputAverageActualWorkload.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IExpertiseScopeRepo } from '../../../repos/expertiseScopeRepo';
import { GetAverageActualWorkloadErrors } from './GetAverageActualWorkloadErrors';

type Response = Either<
    | AppError.UnexpectedError
    | GetAverageActualWorkloadErrors.NoWorkloadLogged,
    Result<AverageActualWorkloadDto[]>
>;

interface ServerResponse {
    data: AverageActualWorkloadDto[];
}

@Injectable()
export class GetAverageActualWorkloadUseCase
    implements IUseCase<{ userId: number; currentDate: Date}, Promise<Response>> {
    constructor(
        @Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
        @Inject('IExpertiseScopeRepo') public readonly expertiseScopeRepo: IExpertiseScopeRepo,
    ) {}

    async execute(params: InputGetAverageActualWorkloadDto): Promise<Response> {
        try {
            const currentWeek = moment(params.currentDate).week();
            const userId = Number(params.userId);

            const url = `${process.env.MOCK_URL}/api/overview/average-actual-workload?userId=${userId}&week=${currentWeek}`;
            const request = await Axios.get<ServerResponse>(url, {
                headers: {
                    'x-api-key': process.env.MOCK_API_KEY,
                },
            });

            const avgActualWorkload = request.data.data;

            if (avgActualWorkload) {
                return right(Result.ok(avgActualWorkload));
            }
            return left(
                new GetAverageActualWorkloadErrors.NoWorkloadLogged(params.userId),
            ) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

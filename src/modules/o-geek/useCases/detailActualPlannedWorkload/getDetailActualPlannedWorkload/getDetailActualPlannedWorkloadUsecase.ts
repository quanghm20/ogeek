import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import {
    DetailActualPlannedWorkloadAndWorklogDto,
    InputDetailPlannedWorkloadAndWorklogDto,
} from '../../../../../modules/o-geek/infra/dtos/detailActualPlannedWorkloadAndWorklog';
import { ProjectDto } from '../../../../../modules/o-geek/infra/dtos/detailActualPlannedWorkloadAndWorklog/project.dto';
import { IUserRepo } from '../../../../../modules/o-geek/repos/userRepo';

type Response = Either<
    AppError.UnexpectedError,
    Result<DetailActualPlannedWorkloadAndWorklogDto>
>;

@Injectable()
export class GetDetailActualPlannedWorkloadUseCase
    implements
        IUseCase<InputDetailPlannedWorkloadAndWorklogDto, Promise<Response>>
{
    constructor(@Inject('IUserRepo') public readonly userRepo: IUserRepo) {}

    async execute(
        inputDetailPlannedWorkloadAndWorklog: InputDetailPlannedWorkloadAndWorklogDto,
    ): Promise<Response> {
        try {
            const user = await this.userRepo.findById(
                inputDetailPlannedWorkloadAndWorklog.userId,
            );
            const queryString =
                inputDetailPlannedWorkloadAndWorklog.expertiseScopes.reduce(
                    (qString, expertiseScope) =>
                        `${qString}data=${expertiseScope}&`,
                    '',
                );
            const url = `
            ${process.env.MOCK_URL}/api/overview/detail-actual-workload?${queryString}userId=${inputDetailPlannedWorkloadAndWorklog.userId}`;
            const request = await Axios.get(url.trim(), {
                headers: {
                    'x-api-key': process.env.MOCK_API_KEY,
                },
            });
            const projects = request.data as ProjectDto[];

            const response = new DetailActualPlannedWorkloadAndWorklogDto();
            response.alias = user.alias;
            response.week = inputDetailPlannedWorkloadAndWorklog.week;
            response.projects = projects;

            return right(Result.ok(response));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { HttpService, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

import { Member } from '../../core/domain/member';
import { MemberEmail } from '../../core/domain/memberEmail';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { UserDTO } from '../../core/infra/user.dto';
import { Result } from '../../core/logic/Result';
import { InputDetailPlannedWorkloadAndWorklogDto } from '../../modules/ogeek/infra/dtos/detailActualPlannedWorkloadAndWorklog';
import { OverviewChartDataDto } from '../../modules/ogeek/infra/dtos/overviewChart/overviewChartData.dto';
import { ValueStreamsDto } from '../../modules/ogeek/infra/dtos/overviewSummaryYear/valueStreams.dto';
import { ConfigService } from './config.service';

@Injectable()
export class SenteService {
    private readonly _logger = new Logger(SenteService.name);
    private readonly _http: HttpService;

    constructor(public configService: ConfigService) {
        this._http = new HttpService();
    }

    // eslint-disable-next-line complexity
    async getUserProfileFromCookie(
        authorization: string,
    ): Promise<Result<any>> {
        const cfg = this.configService.senteConfig;
        try {
            const config = {
                headers: {
                    Authorization: authorization,
                    gua_name: cfg.guaName,
                    gua_secret: cfg.secretAccessKey,
                },
            };

            const response = await this._http
                .get(`${cfg.url}/api/users/auth-token`, config)
                .toPromise();

            if (response?.data?.meta?.ok) {
                const dto = <UserDTO>response?.data?.result?.user;
                const emailOrFailed = MemberEmail.create(dto.email);

                const userOrFailed = Member.create(
                    {
                        email: emailOrFailed.getValue(),
                        alias: dto.alias,
                    },
                    new UniqueEntityID(dto.id),
                );

                return Result.ok(userOrFailed.getValue());
            }

            return Result.fail(response?.data?.message);
        } catch (error) {
            this._logger.error(error?.response?.data);

            this._logger.error(
                `Call to Sente failed because: ${
                    error?.response?.data?.message ?? error?.message
                }`,
            );
            return Result.fail(error?.message ?? error?.data?.message);
        }
    }

    private async _getData<T>(
        endpoint: string,
        data?: any,
        method = 'get',
    ): Promise<AxiosResponse<T>> {
        const url = `${process.env.MOCK_URL}/api/${endpoint}`;
        const axiosOptions = {
            headers: {
                'x-api-key': this.configService.get('MOCK_API_KEY'),
            },
        };

        if (method === 'get') {
            return axios.get<T>(url.trim(), axiosOptions);
        }

        return axios.post<T>(url.trim(), data, axiosOptions);
    }

    async getDetailedActualWorkload(
        inputDetailPlannedWorkloadAndWorklog: InputDetailPlannedWorkloadAndWorklogDto,
    ) {
        const queryString =
            inputDetailPlannedWorkloadAndWorklog.expertiseScopes.reduce(
                (qString, expertiseScope) =>
                    `${qString}data=${expertiseScope}&`,
                '',
            );

        const endpoint = `/overview/detail-actual-workload?${queryString}userId=${inputDetailPlannedWorkloadAndWorklog.userId}`;
        return this._getData(endpoint);
    }

    async getActualWorkload<T>(
        overviewChartDataDtos: OverviewChartDataDto[],
        userId: number,
    ): Promise<AxiosResponse<T>> {
        const endpoint = `/overview/actual-workload?userId=${userId}`;
        return this._getData<T>(endpoint, overviewChartDataDtos, 'post');
    }

    async getAverageActualWorkload<T>(
        expertiseScopeIdArray: number[],
        userId: string,
    ): Promise<AxiosResponse<T>> {
        const queryExpertiseScopeId = expertiseScopeIdArray.reduce(
            (qExpertiseScopeId, expertiseScopeId) =>
                `${qExpertiseScopeId}exId=${expertiseScopeId}&`,
            '',
        );
        const endpoint = `/api/overview/average-actual-workload?userId=${userId}&${queryExpertiseScopeId}`;
        return this._getData<T>(endpoint);
    }

    async getOverviewSumaryYearWorkload<T>(
        valueStreamDtos: ValueStreamsDto[],
        userId: string,
    ): Promise<AxiosResponse<T>> {
        const endpoint = `/overview/summary-year?userId=${userId}`;
        return this._getData<T>(endpoint, valueStreamDtos, 'post');
    }

    async getOverviewListWorkload<T>(week: string): Promise<AxiosResponse<T>> {
        const endpoint = `/overview/list-workload/${week}`;
        return this._getData<T>(endpoint);
    }

    async getOverviewValueStreamCard<T>(
        week: number,
        userId: number,
    ): Promise<AxiosResponse<T>> {
        const endpoint = `/overview/value-stream?userid=${userId}&week=${week}`;
        return this._getData<T>(endpoint);
    }
}

import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Req,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import * as moment from 'moment';

import { JwtPayload } from '../../../../jwt-auth/jwt-auth.strategy';
import { InputGetOverviewChartDto } from '../../../infra/dtos/OverviewChartDto/inputGetOverviewChart.dto';
import { OverviewChartDataDto } from '../../../infra/dtos/OverviewChartDto/overviewChartData.dto';
import { GetOverviewChartDataErrors } from './OverviewChartDataErrors';
import { GetOverviewChartDataUseCase } from './OverviewChartDataUseCase';

@Controller('api/overview/overview-chart')
@ApiTags('Overview Chart')
export class OverviewChartDataController {
    constructor(public readonly useCase: GetOverviewChartDataUseCase) {}
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: OverviewChartDataDto,
        description: 'Data for overview chart',
    })
    @ApiBadRequestResponse({
        type: OverviewChartDataDto,
        description: 'No data to retrieve',
    })
    async execute(@Req() req: Request): Promise<OverviewChartDataDto[]> {
        const currentWeek = moment(new Date()).week();
        const { userId } = req.user as JwtPayload;
        const query = new InputGetOverviewChartDto(userId, currentWeek);
        const result = await this.useCase.execute(query);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetOverviewChartDataErrors.GetOverviewChartDataFailed:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get data for overview chart by ID',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Cannot get data for overview chart',
                    );
            }
        }
        return result.value.getValue();
    }
}

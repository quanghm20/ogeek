import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import * as moment from 'moment';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { InputGetOverviewChartDto } from '../../../infra/dtos/overviewChart/inputGetOverviewChart.dto';
import { OverviewChartDataDto } from '../../../infra/dtos/overviewChart/overviewChartData.dto';
import { GetOverviewChartDataErrors } from './GetOverviewChartDataErrors';
import { GetOverviewChartDataUseCase } from './GetOverviewChartDataUseCase';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/overview/overview-chart')
@ApiTags('Overview')
export class OverviewChartDataController {
    constructor(public readonly useCase: GetOverviewChartDataUseCase) {}
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: OverviewChartDataDto,
        description: 'Data for overview chart',
    })
    @ApiBadRequestResponse({
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
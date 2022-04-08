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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwt-auth-guard';
import { JwtPayload } from '../../../../jwtAuth/jwt-auth.strategy';
import { DataResponseDto } from '../../../infra/dtos/overviewSummaryYear/dataResponse.dto';
import { GetOverviewSummaryYearErrors } from './GetOverviewSummaryYearErrors';
import { GetOverviewSummaryYearUseCase } from './GetOverviewSummaryYearUseCase';

@Controller('api/overview/summary')
@ApiTags('Overview')
@ApiBearerAuth()
export class GetOverviewSummaryYearController {
    constructor(public readonly useCase: GetOverviewSummaryYearUseCase) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DataResponseDto,
        isArray: true,
        description: 'Get overview summary year',
    })
    async getOverviewSummaryYear(
        @Req() req: Request,
    ): Promise<DataResponseDto> {
        const { userId } = req.user as JwtPayload;

        const result = await this.useCase.execute(userId);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetOverviewSummaryYearErrors.NotFound:
                    throw new NotFoundException(error.errorValue());

                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }

        return result.value.getValue();
    }
}

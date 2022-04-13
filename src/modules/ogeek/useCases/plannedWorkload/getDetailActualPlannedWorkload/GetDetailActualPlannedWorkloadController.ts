import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { InputValueStreamByWeekDto } from '../../../../ogeek/infra/dtos/valueStreamsByWeek/inputValueStream.dto';
import {
    DetailActualPlannedWorkloadAndWorklogDto,
    InputDetailPlannedWorkloadAndWorklogDto,
} from '../../../infra/dtos/detailActualPlannedWorkloadAndWorklog';
import { GetDetailActualPlannedWorkloadAndWorklogError } from './GetDetailActualPlannedWorkloadErrors';
import { GetDetailActualPlannedWorkloadUseCase } from './GetDetailActualPlannedWorkloadUseCase';

@Controller('api/planned-workload/detail')
@ApiTags('Planned Workload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GetDetailActualPlannedWorkloadController {
    constructor(
        public readonly useCase: GetDetailActualPlannedWorkloadUseCase,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DetailActualPlannedWorkloadAndWorklogDto,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Interal Server Error',
    })
    async execute(
        @Req() req: Request,
        @Query('data') expertiseScopes: string[],
        @Query() { week }: InputValueStreamByWeekDto,
    ): Promise<DetailActualPlannedWorkloadAndWorklogDto> {
        const { userId } = req.user as JwtPayload;
        const inputDetailPlannedWorkloadAndWorklog = {
            userId,
            expertiseScopes,
            week: Number(week),
        } as InputDetailPlannedWorkloadAndWorklogDto;

        const result = await this.useCase.execute(
            inputDetailPlannedWorkloadAndWorklog,
        );
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetDetailActualPlannedWorkloadAndWorklogError.GetDetailActualPlannedWorkloadAndWorklogFail:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }

        return result.value.getValue();
    }
}

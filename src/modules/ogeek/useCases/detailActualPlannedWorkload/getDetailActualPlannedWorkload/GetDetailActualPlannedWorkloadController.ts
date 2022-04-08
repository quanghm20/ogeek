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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwt-auth-guard';
import { JwtPayload } from '../../../../jwtAuth/jwt-auth.strategy';
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
        description: 'Get detail actual planned workload from each project',
    })
    async execute(
        @Req() req: Request,
        @Query('data') expertiseScopes: string[],
        @Query('week') week: number,
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

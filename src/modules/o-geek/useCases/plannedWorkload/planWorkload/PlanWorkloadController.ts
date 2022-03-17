import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtPayload } from '../../../../jwt-auth/jwt-auth.strategy';
import { CreatePlannedWorkloadsListDto } from '../../../infra/dtos/createPlannedWorkloadsList.dto';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { PlannedWorkloadDto } from '../../../infra/dtos/plannedWorkload.dto';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { PlanWorkloadErrors } from './PlanWorkloadErrors';
import { PlanWorkloadUseCase } from './PlanWorkloadUseCase';

@Controller('api/planned-workload')
@ApiTags('Planned Workload')
export class PlanWorkloadController {
    constructor(public readonly useCase: PlanWorkloadUseCase) {}

    @Post('plan-workload')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({
        type: [PlannedWorkloadDto],
        description: 'plan workload for Geek',
    })
    async execute(
        @Req() req: Request,
        @Body() createPlannedWorkloadsListDto: CreatePlannedWorkloadsListDto,
    ): Promise<PlannedWorkloadDto[]> {
        const jwtPyaload = req.user as JwtPayload;
        const findUserDto = { ...jwtPyaload } as FindUserDto;
        const userId = findUserDto.userId;
        createPlannedWorkloadsListDto.userId = userId;

        const result = await this.useCase.execute(
            createPlannedWorkloadsListDto,
        );
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case PlanWorkloadErrors.PlanWorkloadFailed:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Failed to plan workload',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Some thing when wrong',
                    );
            }
        }

        return PlannedWorkloadMap.fromDomainList(result.value.getValue());
    }
}

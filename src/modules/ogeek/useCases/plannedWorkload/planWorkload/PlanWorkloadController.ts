import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { CreatePlannedWorkloadsListDto } from '../../../infra/dtos/createPlannedWorkload/createPlannedWorkloadsList.dto';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { PlannedWorkloadDto } from '../../../infra/dtos/plannedWorkload.dto';
import { PlanWorkloadErrors } from './PlanWorkloadErrors';
import { PlanWorkloadUseCase } from './PlanWorkloadUseCase';

@Controller('api/planned-workload')
@ApiTags('Planned Workload')
export class PlanWorkloadController {
    constructor(public readonly useCase: PlanWorkloadUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({
        type: [PlannedWorkloadDto],
        description: 'Plan workload for Geek',
    })
    async execute(
        @Req() req: Request,
        @Body() createPlannedWorkloadsListDto: CreatePlannedWorkloadsListDto,
    ): Promise<MessageDto> {
        const jwtPayload = req.user as JwtPayload;
        const findUserDto = { ...jwtPayload } as FindUserDto;
        const userId = findUserDto.userId;

        const result = await this.useCase.execute(
            createPlannedWorkloadsListDto,
            userId,
        );

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case PlanWorkloadErrors.InputValidationFailed:
                    throw new BadRequestException(
                        error.errorValue(),
                        'Failed to validate input',
                    );
                case PlanWorkloadErrors.PlanWorkloadFailed:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Failed to plan workload',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something went wrong',
                    );
            }
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: 'CREATED',
        } as MessageDto;
    }
}

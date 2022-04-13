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
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { DetailCommittedWorkloadsDto } from '../../../../ogeek/infra/dtos/getDetailCommittedWorkload/DetailCommittedWorkloads.dto';
import { GetDetailCommittedWorkloadErrors } from './GetDetailCommittedWorkloadErrors';
import { GetDetailCommittedWorkloadUseCase } from './GetDetailCommittedWorkloadsUseCase';

@Controller('api/admin/committed-workload/detail')
@ApiTags('Committed Workload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GetDetailCommittedWorkloadController {
    constructor(public readonly useCase: GetDetailCommittedWorkloadUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DetailCommittedWorkloadsDto,
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
    async execute(@Req() req: Request): Promise<DetailCommittedWorkloadsDto> {
        const { userId } = req.user as JwtPayload;
        const result = await this.useCase.execute(userId);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetDetailCommittedWorkloadErrors.NotFoundCommittedWorkload:
                    throw new NotFoundException(error.errorValue());
                case GetDetailCommittedWorkloadErrors.NotFoundActualWorklogs:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }

        return result.value.getValue();
    }
}

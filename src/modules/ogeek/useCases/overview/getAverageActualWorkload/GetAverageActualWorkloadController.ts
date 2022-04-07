import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { AverageActualWorkloadDto } from '../../../infra/dtos/getAverageActualWorkload/averageActualWorkload.dto';
import { InputGetAverageActualWorkloadDto } from '../../../infra/dtos/getAverageActualWorkload/inputAverageActualWorkload.dto';
import { GetAverageActualWorkloadErrors } from './GetAverageActualWorkloadErrors';
import { GetAverageActualWorkloadUseCase as GetAverageActualWorkloadUseCase } from './GetAverageActualWorkloadUseCase';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('/api/overview/average-actual-workload')
@ApiTags('Average Actual Workload')
export class GetAverageActualWorkloadController {
    constructor(public readonly useCase: GetAverageActualWorkloadUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: AverageActualWorkloadDto,
        description: 'Average actual workload of Geek',
    })
    async execute(
        @Req() req: Request,
        @Param() currentDate: Date,
    ): Promise<AverageActualWorkloadDto[]> {
        const { userId } = req.user as JwtPayload;
        const query = new InputGetAverageActualWorkloadDto(userId, currentDate);
        const result = await this.useCase.execute(query);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetAverageActualWorkloadErrors.NoWorkloadLogged:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Cannot get average actual workload',
                    );
                case GetAverageActualWorkloadErrors.NoUserFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Cannot find user to get average actual workload',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Cannot get average actual workload',
                    );
            }
        }
        return result.value.getValue();
    }
}

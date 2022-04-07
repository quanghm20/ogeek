import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwt-auth-guard';
import { JwtPayload } from '../../../../jwtAuth/jwt-auth.strategy';
import { InputValueStreamByWeekDto } from '../../../infra/dtos/valueStreamsByWeek/inputValueStream.dto';
import { ValueStreamsByWeekDto } from '../../../infra/dtos/valueStreamsByWeek/valueStreamsByWeek.dto';
import { GetValueStreamError } from './GetValueStreamErrors';
import { GetValueStreamUseCase } from './GetValueStreamUseCase';

@Controller('api/value-stream')
@ApiTags('Value Stream card')
export class GetValueStreamController {
    constructor(public readonly useCase: GetValueStreamUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOkResponse({
        type: ValueStreamsByWeekDto,
        description: 'Get all value streams & expertise scopes in a week',
    })
    async execute(
        @Req() req: Request,
        @Query('week') week: number,
    ): Promise<ValueStreamsByWeekDto> {
        const { userId } = req.user as JwtPayload;
        const inputValueStream = new InputValueStreamByWeekDto(userId, week);
        const result = await this.useCase.execute(inputValueStream);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetValueStreamError.FailToGetValueStream:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get value stream by week',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something wrong happended',
                    );
            }
        }
        return result.value.getValue();
    }
}

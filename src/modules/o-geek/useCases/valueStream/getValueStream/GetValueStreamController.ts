import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../../modules/jwt-auth/jwt-auth-guard';
import { JwtPayload } from '../../../../../modules/jwt-auth/jwt-auth.strategy';
import { InputValueStreamByWeekDto } from '../../../../../modules/o-geek/infra/dtos/ValueStreamsByWeek/inputValueStream.dto';
import { ValueStreamsByWeekDto } from '../../../../../modules/o-geek/infra/dtos/ValueStreamsByWeek/valueStreamsByWeek.dto';
import { GetValueStreamError } from './GetValueStreamErrors';
import { GetValueStreamUseCase } from './GetValueStreamUseCase';

@Controller('api/value-stream')
@ApiTags('Value Stream card')
export class GetValueStreamController {
    constructor(public readonly useCase: GetValueStreamUseCase) {}

    @UseGuards(JwtAuthGuard)
    @Get(':week')
    @ApiOkResponse({
        type: ValueStreamsByWeekDto,
        description: 'Get all value streams & expertise scopes in a week',
    })
    async execute(
        @Req() req: Request,
        @Param('week') inputvalueStreamByWeek: InputValueStreamByWeekDto,
    ): Promise<ValueStreamsByWeekDto> {
        const { userId } = req.user as JwtPayload;
        inputvalueStreamByWeek.userId = userId;

        const result = await this.useCase.execute(inputvalueStreamByWeek);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetValueStreamError.ValueStreamNotFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get value stream by week',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'server error!! ',
                    );
            }
        }
        return result.value.getValue();
    }
}

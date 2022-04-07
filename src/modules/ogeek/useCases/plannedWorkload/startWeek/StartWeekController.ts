import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import * as moment from 'moment';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { StartWeekDto } from '../../../infra/dtos/startWeek/startWeek.dto';
import { StartWeekResponseDto } from '../../../infra/dtos/startWeek/startWeekResponse.dto';
import { StartWeekErrors } from './StartWeekErrors';
import { StartWeekUseCase } from './StartWeekUseCase';

@Controller('api/planned-workload')
@ApiTags('Start Week')
export class StartWeekController {
    constructor(public readonly useCase: StartWeekUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('start-week')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Start week for Geek',
    })
    async execute(
        @Req() req: Request,
        @Body() startWeekDto: StartWeekDto,
    ): Promise<StartWeekResponseDto> {
        const jwtPayload = req.user as JwtPayload;
        const findUserDto = { ...jwtPayload } as FindUserDto;
        const { userId } = findUserDto;

        const { startDate } = startWeekDto;
        const result = await this.useCase.execute(startDate, userId);

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case StartWeekErrors.PreviousWeekNotClose:
                    throw new BadRequestException(error.errorValue());
                case StartWeekErrors.NotPlan:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something went wrong',
                    );
            }
        }

        return { week: moment(startDate).week() } as StartWeekResponseDto;
    }
}

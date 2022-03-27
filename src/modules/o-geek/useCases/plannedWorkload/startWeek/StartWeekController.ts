import {
    BadRequestException,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwt-auth/jwt-auth-guard';
import { JwtPayload } from '../../../../jwt-auth/jwt-auth.strategy';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { StartWeekErrors } from './StartWeekErrors';
import { StartWeekUseCase } from './StartWeekUseCase';

@Controller('api/planned-workload')
@ApiTags('Start Week')
export class StartWeekController {
    constructor(public readonly useCase: StartWeekUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('start-week')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({
        description: 'Start week for Geek',
    })
    async execute(@Req() req: Request): Promise<MessageDto> {
        const jwtPayload = req.user as JwtPayload;
        const findUserDto = { ...jwtPayload } as FindUserDto;

        const result = await this.useCase.execute(findUserDto);

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case StartWeekErrors.StartWeekFailed:
                    throw new BadRequestException(
                        error.errorValue(),
                        'Cannot execute without planning',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something went wrong',
                    );
            }
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'OK',
        } as MessageDto;
    }
}

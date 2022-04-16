import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { StartWeekResponseDto } from '../../../infra/dtos/startWeek/startWeekResponse.dto';
import { GetWarningMessagesErrors } from './GetWarningMessagesErrors';
import { GetWarningMessagesUseCases } from './GetWarningMessagesUseCases';

@Controller('api/planned-workload/warning-messages')
@ApiTags('Planned Workload')
export class GetWarningMessagesController {
    constructor(public readonly useCase: GetWarningMessagesUseCases) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'startDate', example: '2022-04-30 07:00:00+07' })
    @ApiOkResponse({
        type: [StartWeekResponseDto],
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    async execute(
        @Req() req: Request,
        @Query('startDate') startDate: string,
    ): Promise<MessageDto> {
        const jwtPayload = req.user as JwtPayload;
        const findUserDto = { ...jwtPayload } as FindUserDto;
        const { userId } = findUserDto;

        const result = await this.useCase.execute(new Date(startDate), userId);

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetWarningMessagesErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                case GetWarningMessagesErrors.LastWeekNotClosed:
                    throw new BadRequestException(error.errorValue());
                case GetWarningMessagesErrors.GetMessagesFailed:
                    throw new InternalServerErrorException(error.errorValue());
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something went wrong',
                    );
            }
        }

        const { hasPlannedWorkload, weekStatus } = result.value.getValue();

        return {
            statusCode: HttpStatus.OK,
            message: 'Get warning messages successfully',
            data: {
                hasPlannedWorkload,
                weekStatus,
            },
        } as MessageDto;
    }
}

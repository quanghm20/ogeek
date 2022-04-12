import {
    Body,
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { CheckNotificationDto } from '../../../..//ogeek/infra/dtos/notification/checkNotification/checkNotification.dto';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { NotificationDto } from '../../../infra/dtos/notification/getNotifications/getNotification.dto';
import { CheckNotificationErrors } from './CheckNotificationErrors';
import { CheckNotificationUseCase } from './CheckNotificationUseCase';

@Controller('api/user/notification')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CheckNotificationController {
    constructor(public readonly useCase: CheckNotificationUseCase) {}

    @Put()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: NotificationDto,
        isArray: false,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Interal Server Error',
    })
    async execute(
        @Body() body: CheckNotificationDto,
        @Req() req: Request,
    ): Promise<NotificationDto> {
        const { userId } = req.user as JwtPayload;
        const result = await this.useCase.execute(body, userId);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CheckNotificationErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                case CheckNotificationErrors.NotificationNotFound:
                    throw new NotFoundException(error.errorValue());
                case CheckNotificationErrors.Forbidden:
                    throw new ForbiddenException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return result.value.getValue();
    }
}

import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Req,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtPayload } from '../../../../jwt-auth/jwt-auth.strategy';
import { GetWeekStatusDto } from '../../../infra/dtos/getWeekStatus.dto';
import { UserMap } from '../../../mappers/userMap';
import { GetWeekStatusErrors } from './GetWeekStatusErrors';
import { GetWeekStatusUseCase } from './GetWeekStatusUseCase';

@Controller('/api/overview/week-status')
@ApiTags('Week Status')
export class GetWeekStatusController {
    constructor(public readonly useCase: GetWeekStatusUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: GetWeekStatusDto,
        description: 'Week status to show message',
    })
    @ApiBadRequestResponse({
        type: GetWeekStatusDto,
        description: 'No week status to show',
    })
    async execute(@Req() req: Request): Promise<GetWeekStatusDto> {
        const { userId } = req.user as JwtPayload;
        const result = await this.useCase.execute(userId);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetWeekStatusErrors.GetWeekStatusFailed:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get week status by ID',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Cannot get week status',
                    );
            }
        }
        return UserMap.fromDomainWeekStatus(result.value.getValue());
    }
}

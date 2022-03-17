import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GetWeekStatusDto } from '../../../infra/dtos/getWeekStatus.dto';
import { UserMap } from '../../../mappers/userMap';
import { GetWeekStatusErrors } from './GetWeekStatusErrors';
import { GetWeekStatusUseCase } from './GetWeekStatusUseCase';

@Controller('week-status')
@ApiTags('Week Status')
export class GetWeekStatusController {
    constructor(public readonly useCase: GetWeekStatusUseCase) {}

    @Get('id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: GetWeekStatusDto,
        description: 'Week status to show message',
    })
    @ApiBadRequestResponse({
        type: GetWeekStatusDto,
        description: 'No week status to show',
    })
    async execute(@Param('id') userId: number): Promise<GetWeekStatusDto> {
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
        return UserMap.fromDomain(result.value.getValue());
    }
}

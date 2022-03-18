import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ValueStreamsDto } from '../../../infra/dtos/summaryYearDTO/valueStreams.dto';
import { GetOverviewSummaryYearErrors } from './GetOverviewSummaryYearErrors';
import { GetOverviewSummaryYearUseCase } from './GetOverviewSummaryYearUseCase';

@Controller('api/overview/summary-year')
@ApiTags('API overview summary year ')
export class GetOverviewSummaryYearController {
    constructor(public readonly useCase: GetOverviewSummaryYearUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: ValueStreamsDto,
        isArray: true,
        description: 'Get overview summary year',
    })
    async getOverviewSummaryYear(): Promise<ValueStreamsDto[]> {
        const result = await this.useCase.execute(1);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetOverviewSummaryYearErrors.UserNotFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get overview summary year by userId',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Can not search contributed ',
                    );
            }
        }

        return result.value.getValue();
    }
}

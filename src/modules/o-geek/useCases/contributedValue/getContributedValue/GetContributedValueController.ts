import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GetContributedValueShortDto } from '../../../infra/dtos/getContributedValue/getContributedValue.dto';
import { GetContributedValueErrors } from './GetContributedValueErrors';
import { GetContributedValueUseCase } from './GetContributedValueUseCase';

@Controller('api/contributed-values')
@ApiTags('API contributed values workload ')
export class GetContributedValueController {
    constructor(public readonly useCase: GetContributedValueUseCase) {}

    @Get('contributed')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: GetContributedValueShortDto,
        isArray: true,
        description: 'Get all data contributed value',
    })
    async getContributed(): Promise<GetContributedValueShortDto[]> {
        const result = await this.useCase.execute();
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetContributedValueErrors.NotFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get all contributed by id',
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

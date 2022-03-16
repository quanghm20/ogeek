import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CommittedWorkloadDto } from '../../../infra/dtos/committedWorkload.dto';
import { ContributedValueDto } from '../../../infra/dtos/contributedValue.dto';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { CreateCommittedWorkloadErrors } from './CreateCommittedWorkloadErrors';
import { CreateCommittedWorkloadUseCase } from './CreateCommittedWorkloadUseCase';

@Controller('api/committed-workloads')
@ApiTags('API committed workload ')
export class CreateCommittedWorkloadController {
    constructor(public readonly useCase: CreateCommittedWorkloadUseCase) {}

    @Get('contributed')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: ContributedValueDto,
        description: 'Get data contributed value',
    })
    async getContributed(): Promise<ContributedValueDto[]> {
        const result = await this.useCase.getContributedValue();
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreateCommittedWorkloadErrors.NotFound:
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

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: CommittedWorkloadDto,
        description: 'social profile of Geek',
    })
    async execute(
        @Body() body: CreateCommittedWorkloadDto,
    ): Promise<CommittedWorkloadDto> {
        const result = await this.useCase.execute(body);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreateCommittedWorkloadErrors.NotFound:
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

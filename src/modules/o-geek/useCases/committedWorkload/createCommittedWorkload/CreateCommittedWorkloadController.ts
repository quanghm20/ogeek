import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { CreateCommittedWorkloadErrors } from './CreateCommittedWorkloadErrors';
import { CreateCommittedWorkloadUseCase } from './CreateCommittedWorkloadUseCase';

@Controller('api/committed-workloads')
@ApiTags('API committed workload ')
export class CreateCommittedWorkloadController {
    constructor(public readonly useCase: CreateCommittedWorkloadUseCase) {}
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: MessageDto,
        description: 'Created committed workload',
    })
    @ApiBadRequestResponse({
        type: MessageDto,
        description: 'Error',
    })
    async execute(
        @Body() body: CreateCommittedWorkloadDto,
    ): Promise<MessageDto> {
        const result = await this.useCase.execute(body);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreateCommittedWorkloadErrors.NotFound:
                    return new MessageDto(
                        400,
                        "Couldn't find user/ value stream / expertise cope !",
                    );
                default:
                    new MessageDto(500, "Can't create committed workloads.");
            }
        }
        return new MessageDto(201, 'Create Committed workload successfully !.');
    }
}

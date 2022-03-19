import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
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
    @UsePipes(new ValidationPipe({ transform: true }))
    async execute(
        @Body() body: CreateCommittedWorkloadDto,
    ): Promise<MessageDto> {
        const result = await this.useCase.execute(body);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreateCommittedWorkloadErrors.NotFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        "Couldn't find user/ value stream / expertise cope !",
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        "Can't create committed workloads.",
                    );
            }
        }
        return new MessageDto('Create Committed workload successfully !.');
    }
}

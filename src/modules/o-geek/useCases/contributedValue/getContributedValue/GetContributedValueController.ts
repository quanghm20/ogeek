import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../../../../common/constants/role-type';
import { Roles } from '../../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../jwt-auth/jwt-auth-guard';
import { ValueStreamShortInsertDto } from '../../../infra/dtos/getContributedValue/valueStreamShort.dto';
import { GetContributedValueErrors } from './GetContributedValueErrors';
import { GetContributedValueUseCase } from './GetContributedValueUseCase';

@Controller('api/contributed-values')
@ApiTags('API contributed values workload ')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GetContributedValueController {
    constructor(public readonly useCase: GetContributedValueUseCase) {}

    @Get('contributed')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: ValueStreamShortInsertDto,
        isArray: true,
        description: 'Get all data contributed value',
    })
    async getContributed(): Promise<ValueStreamShortInsertDto[]> {
        const result = await this.useCase.execute();
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetContributedValueErrors.NotFound:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return result.value.getValue();
    }
}

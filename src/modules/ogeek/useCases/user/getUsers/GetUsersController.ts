import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { RolesGuard } from '../../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { DataUserShortDto } from '../../../infra/dtos/getUsers/getUsersDto';
import { GetUserErrors } from './GetUsersErrors';
import { GetUsersUseCase } from './GetUsersUseCase';

@ApiTags('User')
@Controller('api/users')
export class GetUsersController {
    constructor(public readonly useCase: GetUsersUseCase) {}

    @Roles(RoleType.PP)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOkResponse({
        type: DataUserShortDto,
        description: 'Get all user',
    })
    async execute(): Promise<DataUserShortDto> {
        const result = await this.useCase.execute();
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetUserErrors.NoUsers:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }

        return new DataUserShortDto(result.value.getValue());
    }
}

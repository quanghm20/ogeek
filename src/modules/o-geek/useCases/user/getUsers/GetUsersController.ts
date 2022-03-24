import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../../jwt-auth/jwt-auth-guard';
import { UserShortDto } from '../../../infra/dtos/getUsers/getUsersDto';
import { UserDto } from '../../../infra/dtos/user.dto';
import { GetUserErrors } from './GetUsersErrors';
import { GetUsersUseCase } from './GetUsersUseCase';

@ApiTags('Users')
@Controller('api/users')
export class GetUsersController {
    constructor(public readonly useCase: GetUsersUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOkResponse({
        type: UserDto,
        description: 'Get all user',
    })
    async execute(): Promise<UserShortDto[]> {
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

        return result.value.getValue();
    }
}

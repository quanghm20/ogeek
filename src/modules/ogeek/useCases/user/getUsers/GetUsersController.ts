import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RolesGuard } from '../../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { DataUserShortDto } from '../../../infra/dtos/getUsers/getUsersDto';
import { GetUserErrors } from './GetUsersErrors';
import { GetUsersUseCase } from './GetUsersUseCase';

@ApiTags('Users')
@Controller('api/users')
export class GetUsersController {
    constructor(public readonly useCase: GetUsersUseCase) {}

    @UseGuards(RolesGuard, JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOkResponse({
        type: DataUserShortDto,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Interal Server Error',
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

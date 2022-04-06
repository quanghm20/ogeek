import {
    BadRequestException,
    Body,
    Controller,
    InternalServerErrorException,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ApiKeyAuthGuard } from '../../../../headerApiKeyAuth/headerApiKeyAuth.guard';
import { UserDto } from '../../../infra/dtos/user.dto';
import { UserMap } from '../../../mappers/userMap';
import { FailToCreateUserErrors } from './CreateUserErrors';
import { CreateUserUseCase } from './CreateUserUseCase';

@Controller('api/user')
@ApiTags('User')
export class CreateUserController {
    constructor(public readonly useCase: CreateUserUseCase) {}

    @ApiHeader({
        name: 'x-api-key',
        description: 'api key to access o-geek product',
    })
    @UseGuards(ApiKeyAuthGuard)
    @Post()
    @ApiOkResponse({
        type: UserDto,
        description: 'Create user',
    })
    async execute(@Body() userInfo: UserDto): Promise<UserDto> {
        const result = await this.useCase.execute(userInfo);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case FailToCreateUserErrors.FailToCreateUser:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'server error!! ',
                    );
            }
        }

        return UserMap.fromDomain(result.value.getValue());
    }
}

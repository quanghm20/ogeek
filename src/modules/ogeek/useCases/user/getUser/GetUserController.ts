import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { UserDto } from '../../../infra/dtos/user.dto';
import { UserMap } from '../../../mappers/userMap';
import { GetUserErrors } from './GetUserErrors';
import { GetUserUseCase } from './GetUserUseCase';

@Controller('api/user')
@ApiTags('Users')
export class GetUserController {
    constructor(public readonly useCase: GetUserUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOkResponse({
        type: UserDto,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Interal Server Error',
    })
    async execute(@Req() req: Request): Promise<UserDto> {
        const jwtPayload = req.user as JwtPayload;
        const findUserDto = { ...jwtPayload } as FindUserDto;

        const result = await this.useCase.execute(findUserDto);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetUserErrors.UserNotFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get user by alias',
                    );
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

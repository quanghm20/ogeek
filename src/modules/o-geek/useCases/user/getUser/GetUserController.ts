import {
    Controller,
    Get,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '../../../../jwt-auth/jwt-auth-guard';
import { JwtPayload } from '../../../../jwt-auth/jwt-auth.strategy';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { UserDto } from '../../../infra/dtos/user.dto';
import { UserMap } from '../../../mappers/userMap';
import { GetUserErrors } from './GetUserErrors';
import { GetUserUseCase } from './GetUserUseCase';

@Controller('api/user')
@ApiTags('User')
export class GetUserController {
    constructor(public readonly useCase: GetUserUseCase) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOkResponse({
        type: UserDto,
        description: 'get user by alias with jwt token',
    })
    async execute(@Req() req: Request, @Res() res: Response): Promise<void> {
        const jwtPyaload = req.user as JwtPayload;
        const findUserDto = { ...jwtPyaload } as FindUserDto;

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

        const user = UserMap.fromDomain(result.value.getValue());
        res.status(HttpStatus.OK).json(user);
    }
}

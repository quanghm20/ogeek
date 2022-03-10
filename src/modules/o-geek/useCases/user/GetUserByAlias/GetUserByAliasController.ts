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

import { AuthenUserDto } from '../../../../../modules/jwt-auth/dto/AuthenUser';
import { JwtAuthGuard } from '../../../../../modules/jwt-auth/jwt-auth-guard';
import { UserMap } from '../../../../../modules/o-geek/mappers/userMap';
import { UserDto } from '../../../infra/dtos/user.dto';
import { GetUserByAliasErrors } from './GetUserByAliasErrors';
import { GetUserByAliasUseCase } from './GetUserByAliasUseCase';

@Controller('api/user')
@ApiTags('User')
export class GetUserByAliasController {
    constructor(public readonly useCase: GetUserByAliasUseCase) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOkResponse({
        type: UserDto,
        description: 'get user by alias with jwt token',
    })
    async execute(@Req() req: Request, @Res() res: Response) {
        const authenuser = req.user as AuthenUserDto;
        const result = await this.useCase.execute(authenuser.alias);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetUserByAliasErrors.UserNotFound:
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
        res.status(HttpStatus.FOUND).json(user);
    }
}

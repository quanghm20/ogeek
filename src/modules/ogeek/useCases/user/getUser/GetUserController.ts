import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { RolesGuard } from '../../../../../guards/roles.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { UserDto } from '../../../infra/dtos/user.dto';
import { UserMap } from '../../../mappers/userMap';
import { GetUserErrors } from './GetUserErrors';
import { GetUserUseCase } from './GetUserUseCase';

@Controller('api/user')
@ApiTags('User')
export class GetUserController {
    constructor(public readonly useCase: GetUserUseCase) {}

    @Roles(RoleType.PP)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOkResponse({
        type: UserDto,
        description: 'Get user by alias with jwt token',
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

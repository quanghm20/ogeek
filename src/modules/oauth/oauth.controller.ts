import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthService } from '../../modules/jwt-auth/jwt-auth.service';
import { User } from '../../modules/o-geek/domain/user';
import { FindUserDto } from '../../modules/o-geek/infra/dtos/findUser.dto';
import { UserDto } from '../../modules/o-geek/infra/dtos/user.dto';
import { UserMap } from '../../modules/o-geek/mappers/userMap';
import { ConfigService } from '../../shared/services/config.service';
import { CreateUserUseCase } from '../o-geek/useCases/user/createUser/CreateUserUseCase';
import { GetUserUseCase } from '../o-geek/useCases/user/getUser/GetUserUseCase';
import { OAuthGuard } from './oauth.guard';

@Controller('')
export class OauthController {
    constructor(
        private _configService: ConfigService,
        private _jwtService: JwtAuthService,
        private _createdUserUseCase: CreateUserUseCase,
        private _getUserUseCase: GetUserUseCase,
    ) {}
    // redirect to authen server
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Get('api/oauth/otable')
    @UseGuards(OAuthGuard)
    login(): string {
        return '';
    }
    // if user is authenticated, they are redirected here
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Get('oauth/otable/callback')
    @UseGuards(OAuthGuard)
    async redirectLogin(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const { username } = req.user as { username: string };
        const userDto = { alias: username, ...req.user } as UserDto;
        // error from user info server
        if (!username) {
            res.redirect(`${this._configService.get('HOME_URL')}/error`);
        }

        const findUserDto = { alias: userDto.alias } as FindUserDto;
        let user = await this._getUserUseCase.execute(findUserDto);
        if (user.isLeft()) {
            user = await this._createdUserUseCase.execute(userDto);
        }

        const mappedUser = UserMap.fromDomain(user.value.getValue() as User);
        const jwtToken = this._jwtService.signJwt(mappedUser);
        res.redirect(`${this._configService.get(
            'HOME_URL',
        )}/user/callback/?accessToken=${jwtToken}
                    &expireIn=${
                        Date.now() +
                        this._configService.getNumber('JWT_EXPIRATION_TIME')
                    }`);
    }
}

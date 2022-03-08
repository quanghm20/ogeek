import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthService } from '../../modules/jwt-auth/jwt-auth.service';
import { UserDto } from '../../modules/o-geek/infra/dtos/user.dto';
import { CreateUserUseCase } from '../../modules/o-geek/useCases/user/createUser/CreateUserUseCase';
import { FindUserByAlias } from '../../modules/o-geek/useCases/user/findUserByAlias/findUserByAlias';
import { ConfigService } from '../../shared/services/config.service';
import { OAuthGuard } from './oauth.guard';

@Controller('')
export class OauthController {
    constructor(
        private _configService: ConfigService,
        private _jwtService: JwtAuthService,
        private _createdUserUseCase: CreateUserUseCase,
        private _findUserByAlias: FindUserByAlias,
    ) {}

    @Get('oauth/otable/callback')
    @UseGuards(OAuthGuard)
    async redirectLogin(@Req() req: Request, @Res() res: Response) {
        const user = req.user as UserDto;
        const jwtToken = this._jwtService.signJwt(user);
        const findedUser = await this._findUserByAlias.findUserByAlias(
            user.username,
        );
        if (!findedUser) {
            await this._createdUserUseCase.createUser(user);
        }

        res.cookie(
            'jwt',
            JSON.stringify({
                accessToken: jwtToken,
                expiresIn: this._configService.getNumber('JWT_EXPIRATION_TIME'),
            }),
        );
        return res.redirect(this._configService.get('HOME_URL'));
    }

    @Get('api/oauth/otable/')
    @UseGuards(OAuthGuard)
    login() {
        return '';
    }
}

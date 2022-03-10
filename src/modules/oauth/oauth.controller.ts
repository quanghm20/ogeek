import {
    Controller,
    Get,
    HttpStatus,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthService } from '../../modules/jwt-auth/jwt-auth.service';
import { UserDto } from '../../modules/o-geek/infra/dtos/user.dto';
import { CreateUserUseCase } from '../../modules/o-geek/useCases/user/createUser/CreateUserUseCase';
import { GetUserByAliasUseCase } from '../../modules/o-geek/useCases/user/GetUserByAlias/GetUserByAliasUseCase';
import { ConfigService } from '../../shared/services/config.service';
import { OAuthGuard } from './oauth.guard';

@Controller('')
export class OauthController {
    constructor(
        private _configService: ConfigService,
        private _jwtService: JwtAuthService,
        private _createdUserUseCase: CreateUserUseCase,
        private _getUserByAlias: GetUserByAliasUseCase,
    ) {}
    // redirect to authen server
    @Get('api/oauth/otable')
    @UseGuards(OAuthGuard)
    login() {
        return '';
    }
    // if user is authenticated, they are redirected here
    @Get('oauth/otable/callback')
    @UseGuards(OAuthGuard)
    async redirectLogin(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = req.user as UserDto;
        const jwtToken = this._jwtService.signJwt(user);
        const findedUser = await this._getUserByAlias.execute(user.username);
        if (findedUser.isLeft()) {
            await this._createdUserUseCase.execute(user);
        }
        const jwtCookie = JSON.stringify({
            accessToken: jwtToken,
            expiresIn: this._configService.getNumber('JWT_EXPIRATION_TIME'),
        });
        res.cookie('jwt', jwtCookie);
        res.status(HttpStatus.ACCEPTED);
    }
}

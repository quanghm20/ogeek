import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    // HttpCode,
    // HttpStatus,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

// import { JwtAuthService } from '../../modules/jwt-auth/jwt-auth.service';
import { OAuthGuard } from '../../guards/oauth.guard';
import { UserDto } from '../../modules/user/dto/UserDto';
import { ConfigService } from '../../shared/services/config.service';
import { AuthService } from './auth.service';
// import { UserLoginDto } from './dto/UserLoginDto';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { UserOAuth2Dto } from './dto/UserOAuth2Dto';

@Controller('')
export class OauthController {
    constructor(
        private _configService: ConfigService,
        public readonly authService: AuthService,
    ) {}

    @Get('api/oauth/otable')
    @HttpCode(HttpStatus.FOUND)
    @ApiOkResponse()
    @UseGuards(OAuthGuard)
    login(): string {
        return 'login with otable';
    }

    @Get('api/oauth/otable/callback')
    @HttpCode(HttpStatus.FOUND)
    @ApiOkResponse()
    @UseGuards(OAuthGuard)
    async redirectLogin(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<any> {
        const userOAuth2Dto = {
            alias: (req.user as UserDto).username,
        } as UserOAuth2Dto;
        const accessToken = await this.authService.createToken(userOAuth2Dto);
        res.cookie(
            'jwt',
            JSON.stringify({
                accessToken: new LoginPayloadDto(userOAuth2Dto, accessToken),
                expiresIn: this._configService.getNumber('JWT_EXPIRATION_TIME'),
            }),
        );
        return res.redirect(this._configService.get('HOME_URL'));
    }
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { HttpService, Injectable, Logger } from '@nestjs/common';

import { Member } from '../../core/domain/member';
import { MemberEmail } from '../../core/domain/memberEmail';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { UserDTO } from '../../core/infra/user.dto';
import { Result } from '../../core/logic/Result';
import { ConfigService } from './config.service';

@Injectable()
export class SenteService {
    private readonly _logger = new Logger(SenteService.name);
    private readonly _http: HttpService;

    constructor(public configService: ConfigService) {
        this._http = new HttpService();
    }

    // eslint-disable-next-line complexity
    async getUserProfileFromCookie(
        authorization: string,
    ): Promise<Result<any>> {
        const cfg = this.configService.senteConfig;
        try {
            const config = {
                headers: {
                    Authorization: authorization,
                    gua_name: cfg.guaName,
                    gua_secret: cfg.secretAccessKey,
                },
            };

            const response = await this._http
                .get(`${cfg.url}/api/users/auth-token`, config)
                .toPromise();

            if (response?.data?.meta?.ok) {
                const dto = <UserDTO>response?.data?.result?.user;
                const emailOrFailed = MemberEmail.create(dto.email);

                const userOrFailed = Member.create(
                    {
                        email: emailOrFailed.getValue(),
                        alias: dto.alias,
                    },
                    new UniqueEntityID(dto.id),
                );

                return Result.ok(userOrFailed.getValue());
            }

            return Result.fail(response?.data?.message);
        } catch (error) {
            this._logger.error(error?.response?.data);

            this._logger.error(
                `Call to Sente failed because: ${
                    error?.response?.data?.message ?? error?.message
                }`,
            );
            return Result.fail(error?.message ?? error?.data?.message);
        }
    }
}

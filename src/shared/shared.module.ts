import { Global, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { SenteService } from './services/sente.service';
import { ValidatorService } from './services/validator.service';

const providers = [
    ConfigService,
    ValidatorService,
    GeneratorService,
    SenteService,
];

@Global()
@Module({
    providers,
    imports: [
        HttpModule,
        JwtModule.registerAsync({
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            imports: [SharedModule],
            useFactory: (configService: ConfigService) => ({
                secretOrPrivateKey: configService.get('JWT_SECRET_KEY'),
                // if you want to use token with expiration date
                // signOptions: {
                //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
                // },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}

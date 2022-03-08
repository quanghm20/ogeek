import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { contextMiddleware } from './middlewares';
import { JwtAuthModule } from './modules/jwt-auth/jwt-auth.module';
import { OGeekModule } from './modules/o-geek/o-geek.module';
import { OauthController } from './modules/oauth/oauth.controller';
import { OauthModule } from './modules/oauth/oauth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        JwtAuthModule,
        OauthModule,
        UserModule,
        OGeekModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
        OauthModule,
    ],
    providers: [],
    controllers: [OauthController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}

import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [],
    controllers: [UserController],
    exports: [UserService],
    providers: [UserService],
})
export class UserModule {}

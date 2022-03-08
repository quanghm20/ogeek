/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';

import { UserEntity } from '../../../../../modules/o-geek/infra/database/entities/user.entity';
import { UserRepository } from '../../../../../modules/o-geek/repos';

@Injectable()
export class FindUserByAlias {
    async findUserByAlias(alias: string): Promise<UserEntity | undefined> {
        const userRepository = getCustomRepository(UserRepository);
        return userRepository.findOne({ alias });
    }
}

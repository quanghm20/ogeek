/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';

import { UserEntity } from '../../../../../modules/o-geek/infra/database/entities/user.entity';
import { UserDto } from '../../../../../modules/o-geek/infra/dtos/user.dto';
import { UserRepository } from '../../../../../modules/o-geek/repos';

@Injectable()
export class CreateUserUseCase {
    async createUser(userDto: UserDto): Promise<UserEntity> {
        const userRepository = getCustomRepository(UserRepository);
        const user = userRepository.create({
            alias: userDto.username,
            name: userDto.name,
            email: userDto.email,
        });
        return userRepository.save(user);
    }
}

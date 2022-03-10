import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserDto } from '../infra/dtos/user.dto';
import { UserMap } from '../mappers/userMap';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        protected repo: Repository<UserEntity>,
    ) {}

    async findByAlias(alias: string): Promise<User> {
        const entity = await this.repo.findOne({ alias });
        return entity ? UserMap.toDomain(entity) : null;
    }

    async createUser(userDto: UserDto): Promise<User> {
        const entity = this.repo.create({
            alias: userDto.username,
            ...userDto,
        });
        const createdUser = await this.repo.save(entity);
        return createdUser ? UserMap.toDomain(entity) : null;
    }
}

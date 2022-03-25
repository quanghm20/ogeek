import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserDto } from '../infra/dtos/user.dto';
import { UserMap } from '../mappers/userMap';

export interface IUserRepo {
    findAll(): Promise<User[]>;
    findById(userId: DomainId | number): Promise<User>;
    findByAlias(alias: string): Promise<User>;
    createUser(userDto: UserDto): Promise<User>;
}

@Injectable()
export class UserRepository implements IUserRepo {
    constructor(
        @InjectRepository(UserEntity)
        protected repo: Repository<UserEntity>,
    ) {}
    async findByAlias(alias: string): Promise<User> {
        const entity = await this.repo.findOne({ alias });
        return entity ? UserMap.toDomain(entity) : null;
    }

    async findById(userId: DomainId | number): Promise<User> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.findOne(userId);
        return entity ? UserMap.toDomain(entity) : null;
    }

    async findAll(): Promise<User[]> {
        const entities = await this.repo.find();
        return entities ? UserMap.toDomainAll(entities) : null;
    }

    async createUser(userDto: UserDto): Promise<User> {
        const entity = this.repo.create({
            alias: userDto.alias,
            name: userDto.name,
            phone: userDto.phone,
            email: userDto.email,
            avatar: userDto.avatar,
            role: userDto.role,
            weekStatus: userDto.weekStatus,
        });
        const createdUser = await this.repo.save(entity);
        return createdUser ? UserMap.toDomain(entity) : null;
    }
}

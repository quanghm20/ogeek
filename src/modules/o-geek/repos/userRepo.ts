import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserDto } from '../infra/dtos/user.dto';
import { UserMap } from '../mappers/userMap';

export interface IUserRepo {
    findById(userId: DomainId | number): Promise<User>;
    findByAlias(alias: string): Promise<User>;
    findAllUser(): Promise<User[]>;
}

@Injectable()
export class UserRepository implements IUserRepo {
    constructor(
        @InjectRepository(UserEntity)
        protected repo: Repository<UserEntity>,
    ) {}
    async findAllUser(): Promise<User[]> {
        const users = await this.repo.find({});
        return users ? UserMap.toArrayDomain(users) : null;
    }
    async findByAlias(alias: string): Promise<User> {
        const entity = await this.repo.findOne({ where: { alias } });
        return entity ? UserMap.toDomain(entity) : null;
    }

    async findById(userId: DomainId | number): Promise<User> {
        const id =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.findOne(id);
        return entity ? UserMap.toDomain(entity) : null;
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

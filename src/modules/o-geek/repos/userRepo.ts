import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserMap } from '../mappers/userMap';

export interface IUserRepo {
    findById(userId: DomainId | number): Promise<User>;
}

@Injectable()
export class UserRepository implements IUserRepo {
    constructor(
        @InjectRepository(User)
        protected repo: Repository<UserEntity>,
    ) {}

    async findById(userId: DomainId | number): Promise<User> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.findOne(userId);
        return entity ? UserMap.toDomain(entity) : null;
    }
}

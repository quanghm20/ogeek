import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AggregateId } from '../domain/aggregateId';
import { Profile } from '../domain/profile';
import { ProfileEntity } from '../infra/database/entities/profile.entity';
import { ProfileMap } from '../mappers/profileMap';

export interface IProfileRepo {
    findById(id: AggregateId | string): Promise<Profile>;
}

@Injectable()
export class ProfileRepository implements IProfileRepo {
    constructor(
        @InjectRepository(ProfileEntity)
        protected repo: Repository<ProfileEntity>,
    ) {}

    async findById(profileId: AggregateId | string): Promise<Profile> {
        profileId =
            profileId instanceof AggregateId
                ? profileId.id.toString()
                : profileId;
        const entity = await this.repo.findOne(profileId);
        return entity ? ProfileMap.toDomain(entity) : null;
    }
}

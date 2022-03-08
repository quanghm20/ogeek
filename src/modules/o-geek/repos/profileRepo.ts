import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profile } from '../domain/profile';
import { ProfileId } from '../domain/profileId';
import { ProfileEntity } from '../infra/database/entities/profile.entity';
import { ProfileMap } from '../mappers/profileMap';

export interface IProfileRepo {
    findById(id: ProfileId | string): Promise<Profile>;
}

@Injectable()
export class ProfileRepository implements IProfileRepo {
    constructor(
        @InjectRepository(ProfileEntity)
        protected repo: Repository<ProfileEntity>,
    ) {}

    async findById(profileId: ProfileId | string): Promise<Profile> {
        profileId =
            profileId instanceof ProfileId
                ? profileId.id.toString()
                : profileId;
        const entity = await this.repo.findOne(profileId);
        return entity ? ProfileMap.toDomain(entity) : null;
    }
}

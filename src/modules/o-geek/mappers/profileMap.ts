import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { Profile } from '../domain/profile';
import { ProfileEntity } from '../infra/database/entities/profile.entity';
import { ProfileDto } from '../infra/dtos/profile.dto';

export class ProfileMap implements Mapper<Profile> {
    public static toDTO(profile: Profile): ProfileDto {
        return {
            id: profile.profileId.id.toString(),
            facebookLink: profile.facebookLink,
            createdAt: profile.createdAt,
        };
    }

    public static toDomain(raw: ProfileEntity): Profile {
        const { id } = raw;

        const profileOrError = Profile.create(
            {
                createdAt: raw.createdAt,
                facebookLink: raw.facebookLink,
            },
            new UniqueEntityID(id),
        );

        return profileOrError.isSuccess ? profileOrError.getValue() : null;
    }
}

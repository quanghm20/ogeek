import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserDto } from '../infra/dtos/user.dto';

export class UserMap implements Mapper<User> {
    public static fromDomain(user: User): UserDto {
        return {
            id: user.userId.id,
            alias: user.alias,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            weekStatus: user.weekStatus,
            avatar: user.avatar,
        };
    }

    public static toDomain(raw: UserEntity): User {
        const { id } = raw;
        const profileOrError = User.create(
            {
                alias: raw.alias,
                email: raw.email,
                name: raw.name,
                phone: raw.phone,
                role: raw.role,
                weekStatus: raw.weekStatus,
                avatar: raw.avatar,
            },
            new UniqueEntityID(id),
        );

        return profileOrError.isSuccess ? profileOrError.getValue() : null;
    }
}

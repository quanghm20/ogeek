import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserDto } from '../infra/dtos/user.dto';

export class UserMap implements Mapper<User> {
    public static fromDomain(user: User): UserDto {
        return {
            id: Number(user.userId.id.toValue()),
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
        const userOrError = User.create(
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

        return userOrError.isSuccess ? userOrError.getValue() : null;
    }

    public static toEntity(user: User): UserEntity {
        const entity = new UserEntity();

        // entity.id = Number(user.id.toValue());
        entity.alias = user.alias;
        entity.email = user.email;
        entity.name = user.name;
        entity.phone = user.phone;
        entity.role = user.role;
        entity.weekStatus = user.weekStatus;
        entity.avatar = user.avatar;

        return entity;
    }
}

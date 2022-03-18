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

    public static toDomain(userEntity: UserEntity): User {
        const { id } = userEntity;
        const userOrError = User.create(
            {
                alias: userEntity.alias,
                email: userEntity.email,
                name: userEntity.name,
                phone: userEntity.phone,
                role: userEntity.role,
                weekStatus: userEntity.weekStatus,
                avatar: userEntity.avatar,
            },
            new UniqueEntityID(id),
        );

        return userOrError.isSuccess ? userOrError.getValue() : null;
    }
}

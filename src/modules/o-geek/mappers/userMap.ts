import { RoleType } from '../../../common/constants/role-type';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserDto } from '../infra/dtos/user.dto';

export class UserMap implements Mapper<User> {
    public static fromDomain(user: User): UserDto {
        return {
            alias: user.alias,
            name: user.name,
            email: user.email,
            sub: user.userId.id.toValue().toString(),
            avatar: user.avatar,
            phone: user.phone,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: user.role,
            id: user.userId.id.toValue() as number,
        };
    }

    public static toDomain(raw: UserEntity): User {
        const { id } = raw;
        const userOrError = User.create(
            {
                alias: raw.alias,
                name: raw.name,
                email: raw.email,
                phone: raw.phone,
                avatar: raw.avatar,
                role: RoleType[raw.role],
            },
            new UniqueEntityID(id),
        );

        return userOrError.isSuccess ? userOrError.getValue() : null;
    }
}

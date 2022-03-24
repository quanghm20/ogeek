import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserShortDto } from '../infra/dtos/getUsers/getUsersDto';
import { GetWeekStatusDto } from '../infra/dtos/getWeekStatus.dto';
import { UserDto } from '../infra/dtos/user.dto';

export class UserMap implements Mapper<User> {
    public static fromDomain(user: User): UserDto {
        return {
            id: new UniqueEntityID(user.userId.id.toValue()),
            alias: user.alias,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            weekStatus: user.weekStatus,
            avatar: user.avatar,
        };
    }
    public static fromDomainWeekStatus(user: User): GetWeekStatusDto {
        return {
            weekStatus: user.weekStatus,
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

    public static toArrayDomain(raws: UserEntity[]): User[] {
        const arrayDomain = Array<User>();
        raws.forEach((user) => {
            arrayDomain.push(this.toDomain(user));
        });
        return arrayDomain;
    }

    public static toEntity(user: User): UserEntity {
        const userEntity = new UserEntity();
        userEntity.alias = user.alias;
        userEntity.name = user.name;
        userEntity.email = user.email;
        userEntity.phone = user.phone;
        userEntity.id = Number(user.id.toValue());
        userEntity.role = user.role;
        userEntity.weekStatus = user.weekStatus;
        userEntity.avatar = user.avatar;

        return userEntity;
    }

    public static toUserShort(user: User): UserShortDto {
        const id = Number(user.id.toValue());
        return new UserShortDto(id, user.alias);
    }

    public static toArrayUserShort(users: User[]): UserShortDto[] {
        const arrayUserShort = new Array<UserShortDto>();
        users.forEach((user) => {
            arrayUserShort.push(this.toUserShort(user));
        });
        return arrayUserShort;
    }
}

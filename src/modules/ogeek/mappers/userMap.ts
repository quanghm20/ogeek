import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserCompactDto } from '../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { UserShortDto } from '../infra/dtos/getUsers/getUsersDto';
import { UserDto } from '../infra/dtos/user.dto';

export class UserMap implements Mapper<User> {
    public static fromDomain(user: User): UserDto {
        const dto = new UserDto();
        dto.id = new UniqueEntityID(user.userId.id.toValue());
        dto.alias = user.alias;
        dto.email = user.email;
        dto.name = user.name;
        dto.phone = user.phone;
        dto.role = user.role;
        dto.avatar = user.avatar;
        return dto;
    }
    public static fromUserShort(user: User): UserCompactDto {
        const id = Number(user.id.toValue());
        return new UserCompactDto(id, user.alias, user.name);
    }
    // public static fromDomainWeekStatus(user: User): GetWeekStatusDto {
    //     return {
    //         weekStatus: user.weekStatus,
    //     };
    // }

    public static toDomain(raw: UserEntity): User {
        const { id } = raw;
        const userOrError = User.create(
            {
                alias: raw.alias,
                email: raw.email,
                name: raw.name,
                phone: raw.phone,
                role: raw.role,
                avatar: raw.avatar,
                createdAt: raw.createdAt,
            },
            new UniqueEntityID(id),
        );
        return userOrError.isSuccess ? userOrError.getValue() : null;
    }

    public static toDomainAll(users: UserEntity[]): User[] {
        const userArray = new Array<User>();
        users.forEach((user) => {
            const userOrError = UserMap.toDomain(user);
            if (userOrError) {
                userArray.push(userOrError);
            } else {
                return null;
            }
        });

        return userArray;
    }

    public static fromDomainAll(users: User[]): UserDto[] {
        const arrUserDto = new Array<UserDto>();
        users.forEach((user) => arrUserDto.push(UserMap.fromDomain(user)));
        return arrUserDto;
    }

    public static toArrayDomain(raws: UserEntity[]): User[] {
        const arrayDomain = Array<User>();
        raws.forEach((user) => {
            arrayDomain.push(this.toDomain(user));
        });
        return arrayDomain;
    }

    public static toEntity(user: User): UserEntity {
        return {
            ...user.props,
        } as UserEntity;
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    // Connection,
    getConnection,
    Repository,
    // SelectQueryBuilder,
} from 'typeorm';

import { DomainId } from '../domain/domainId';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { PaginationDto } from '../infra/dtos/pagination.dto';
import { UserDto } from '../infra/dtos/user.dto';
import { HistoryWorkloadDto } from '../infra/dtos/workloadListUsers/historyWorkload.dto';
import { UserMap } from '../mappers/userMap';

export interface IUserRepo {
    findById(userId: DomainId | number): Promise<User>;
    findByAlias(alias: string): Promise<User>;
    findAllUser(): Promise<User[]>;
    update(condition: any, update: any): Promise<void>;
    findListUserWorkload(
        pagination: PaginationDto,
    ): Promise<HistoryWorkloadDto[]>;
    // findListUserWorkloadTest(
    //     pagination: PaginationDto,
    // ): Promise<HistoryWorkloadDto[]>;
}

@Injectable()
export class UserRepository implements IUserRepo {
    constructor(
        @InjectRepository(UserEntity)
        protected repo: Repository<UserEntity>,
    ) {}
    async findAllUser(): Promise<User[]> {
        const users = await this.repo.find({});
        return users ? UserMap.toArrayDomain(users) : null;
    }
    async findByAlias(alias: string): Promise<User> {
        const entity = await this.repo.findOne({ where: { alias } });
        return entity ? UserMap.toDomain(entity) : null;
    }

    async findById(userId: DomainId | number): Promise<User> {
        const id =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.findOne(id);
        return entity ? UserMap.toDomain(entity) : null;
    }

    async createUser(userDto: UserDto): Promise<User> {
        try {
            const entity = this.repo.create({
                alias: userDto.alias,
                name: userDto.name,
                phone: userDto.phone,
                email: userDto.email,
                avatar: userDto.avatar,
                role: userDto.role,
            });
            const createdUser = await this.repo.save(entity);
            return createdUser ? UserMap.toDomain(entity) : null;
        } catch (err) {
            return null;
        }
    }

    async update(condition: any, update: any): Promise<void> {
        await this.repo.update(condition, update);
    }

    async findListUserWorkload(
        pagination: PaginationDto,
    ): Promise<HistoryWorkloadDto[]> {
        return (await getConnection()
            .query(`select "user"."alias", "user"."id", "user"."avatar", "issue"."note", "issue"."status",
             SUM("com"."committed_workload") as "committed_workload" from "user"
left join "committed_workload" as com on "user"."id" = "com"."user_id"
left join (
select * from (
select "id", 
           "user_id",
           "updated_at",
           "status",
           "note",
           row_number() over (partition by "user_id" order by "updated_at" desc) as rank 
    from "issue") ranks
where rank = 1) as issue on "user"."id" = "issue"."user_id"
where "com"."status" = 'ACTIVE' or "com"."status" = 'NOT RENEW'
group by "user"."alias", "issue"."status", "user"."avatar", "issue"."note", "user"."id"
order by ${pagination.order}
limit ${pagination.limit} offset ${
            pagination.limit * pagination.page
        }`)) as HistoryWorkloadDto[];
    }

    // async findListUserWorkloadTest(
    //     pagination: PaginationDto,
    // ): Promise<HistoryWorkloadDto[]> {
    //     // console.log(pagination);

    //     const users = await this.repo
    //         .createQueryBuilder('user')
    //         .leftJoinAndSelect('user.issue', 'issue')
    //         .leftJoinAndSelect('user.committedWorkloads', 'committed_workloads')
    //         // .groupBy('user.id')
    //         .orderBy('issue.status', 'DESC')
    //         .skip(0)
    //         .take(3)
    //         .getRawMany();

    //     return users as HistoryWorkloadDto[];
    // }
}

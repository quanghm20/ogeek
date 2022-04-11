import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { CommittedWorkloadStatus } from '../../../common/constants/committedStatus';
import { DomainId } from '../domain/domainId';
import { User } from '../domain/user';
import { IssueEntity } from '../infra/database/entities';
import { UserEntity } from '../infra/database/entities/user.entity';
import { PaginationRepoDto } from '../infra/dtos/pagination.dto';
import { UserDto } from '../infra/dtos/user.dto';
import { HistoryWorkloadDto } from '../infra/dtos/workloadListUsers/historyWorkload.dto';
import { HistoryWorkloadDataDto } from '../infra/dtos/workloadListUsers/historyWorkloadData.dto';
import { UserMap } from '../mappers/userMap';

export interface IUserRepo {
    findById(userId: DomainId | number): Promise<User>;
    findByAlias(alias: string): Promise<User>;
    findAllUser(): Promise<User[]>;
    update(condition: any, update: any): Promise<void>;
    findListUserWorkload(
        pagination: PaginationRepoDto,
        firstDateOfWeek: Date,
        endDateOfCurrentWeek: Date,
    ): Promise<HistoryWorkloadDataDto>;
}

@Injectable()
export class UserRepository implements IUserRepo {
    constructor(
        @InjectRepository(UserEntity)
        protected repo: Repository<UserEntity>,
        @InjectRepository(IssueEntity)
        protected issueRepo: Repository<IssueEntity>,
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
        pagination: PaginationRepoDto,
        firstDateOfWeek: Date,
        endDateOfCurrentWeek: Date,
    ): Promise<HistoryWorkloadDataDto> {
        const subQuery = this.issueRepo
            .createQueryBuilder('issue')
            .select('issue.note', 'note')
            .addSelect('issue.status', 'status')
            .addSelect('issue.user_id', 'id')
            .addSelect(
                'row_number() over (partition by "user_id" order by "updated_at" desc) as rank',
            )
            .where(
                `issue.created_at >= '${firstDateOfWeek.toISOString()}' 
                AND issue.created_at <= '${endDateOfCurrentWeek.toISOString()}'`,
            );

        const issueQuery = getConnection()
            .createQueryBuilder()
            .select(['note', 'status', 'id'])
            .from('(' + subQuery.getQuery() + ')', 'ranks')
            .where('rank = 1');

        const historyWorkloads = this.repo
            .createQueryBuilder('user')
            .select('user.id', 'userId')
            .addSelect('user.alias', 'alias')
            .addSelect('user.avatar', 'avatar')
            .leftJoin('user.committedWorkloads', 'committed_workload')
            .leftJoin(
                '(' + issueQuery.getQuery() + ')',
                'issue',
                '"user"."id" = "issue"."id"',
            )
            .addSelect(
                'SUM("committed_workload"."committed_workload")',
                'committed_workload',
            )
            .addSelect(['issue.note', 'issue.status'])
            .groupBy('user.id')
            .addGroupBy('user.alias')
            .addGroupBy('user.avatar')
            .addGroupBy('issue.status')
            .addGroupBy('issue.note')
            .addGroupBy('committed_workload.status')
            .having('committed_workload.status = :name', {
                name: CommittedWorkloadStatus.ACTIVE,
            })
            .orHaving('committed_workload.status = :name2', {
                name2: CommittedWorkloadStatus.NOT_RENEW,
            });

        const total = await historyWorkloads.getRawMany();
        const count = total.length;

        const historyWorkloadsQuery = await historyWorkloads
            .orderBy(pagination.order)
            .offset(pagination.page * pagination.limit)
            .limit(pagination.limit)
            .getRawMany();

        return {
            itemCount: count,
            data: historyWorkloadsQuery as HistoryWorkloadDto[],
        } as HistoryWorkloadDataDto;
    }
}

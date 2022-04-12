/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, getConnection, Repository } from 'typeorm';

import { IssueStatus } from '../../../common/constants/issueStatus';
import { DomainId } from '../domain/domainId';
import { Issue } from '../domain/issue';
import { UserEntity } from '../infra/database/entities';
import { IssueEntity } from '../infra/database/entities/issue.entity';
import { InputPotentialIssueDto } from '../infra/dtos/getPotentialIssue/inputPotentialIssue.dto';
import { StartEndDateOfWeekWLInputDto } from '../infra/dtos/workloadListByWeek/startEndDateOfWeekInput.dto';
import { IssueMap } from '../mappers/issueMap';

export interface IIssueRepo {
    findById(valueStreamId: DomainId | number): Promise<Issue>;
    findAll(): Promise<Issue[]>;
    findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<Issue[]>;
    save(userId: number, week: number, type: IssueStatus): Promise<Issue>;
    findByUserId(
        startDateOfWeek: string,
        endDateOfWeek: string,
        userId: number,
    ): Promise<Issue>;
    findByUserIdAndWeek({
        userId,
        firstDateOfWeek,
    }: InputPotentialIssueDto): Promise<Issue>;
    update(condition: any, update: any): Promise<void>;
    createMany(entities: IssueEntity[]): Promise<Issue[]>;
}

@Injectable()
export class IssueRepository implements IIssueRepo {
    constructor(
        @InjectRepository(IssueEntity)
        protected repo: Repository<IssueEntity>,
    ) {}

    async findById(issueId: DomainId | number): Promise<Issue> {
        issueId =
            issueId instanceof DomainId
                ? Number(issueId.id.toValue())
                : issueId;
        const entity = await this.repo.findOne(issueId);
        return entity ? IssueMap.toDomain(entity) : null;
    }

    async findAll(): Promise<Issue[]> {
        const entities = await this.repo.find({
            relations: ['user'],
        });
        return entities ? IssueMap.toDomainAll(entities) : null;
    }

    async findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<Issue[]> {
        const entities = await this.repo.find({
            where: {
                createdAt: Between(startDateOfWeek, endDateOfWeek),
            },
            relations: ['user'],
        });

        return entities ? IssueMap.toDomainAll(entities) : new Array<Issue>();
    }

    async findByUserId(
        startDateOfWeek: string,
        endDateOfWeek: string,
        userId: number,
    ): Promise<Issue> {
        const entity = await this.repo.findOne({
            where: {
                user: { id: userId },
                createdAt: Between(startDateOfWeek, endDateOfWeek),
            },
            relations: ['user'],
        });

        return entity ? IssueMap.toDomain(entity) : null;
    }

    async findByUserIdAndWeek({
        userId,
        firstDateOfWeek,
    }: InputPotentialIssueDto): Promise<Issue> {
        const entity = await this.repo.findOne({
            where: {
                user: { id: userId },
                dateOfWeek: Equal(firstDateOfWeek),
            },
            relations: ['user'],
        });
        return entity ? IssueMap.toDomain(entity) : null;
    }

    async update(condition: any, update: any): Promise<void> {
        await this.repo.update(condition, update);
    }

    async save(
        userId: number,
        week: number,
        type: IssueStatus,
    ): Promise<Issue> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        try {
            const user = new UserEntity(userId);

            await queryRunner.startTransaction();
            const issue = new IssueEntity();
            await queryRunner.manager.save(issue);
            await queryRunner.commitTransaction();
            // return HttpStatus.CREATED;
            return issue ? IssueMap.toDomain(issue) : null;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            // return HttpStatus.INTERNAL_SERVER_ERROR;
        } finally {
            await queryRunner.release();
        }
    }

    async createMany(entities: IssueEntity[]): Promise<Issue[]> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();

            const issue = await queryRunner.manager.save(IssueEntity, entities);
            await queryRunner.commitTransaction();
            return issue || issue.length === 0
                ? IssueMap.toDomainAll(issue)
                : null;
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}

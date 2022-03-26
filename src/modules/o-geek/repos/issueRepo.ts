import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { Issue } from '../domain/issue';
import { IssueEntity } from '../infra/database/entities/issue.entity';
import { StartEndDateOfWeekWLInputDto } from '../infra/dtos/workloadListByWeek/startEndDateOfWeekInput.dto';
import { IssueMap } from '../mappers/issueMap';

export interface IIssueRepo {
    findById(valueStreamId: DomainId | number): Promise<Issue>;
    findAll(): Promise<Issue[]>;
    findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<Issue[]>;
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
        const entities = await this.repo.find();
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
}

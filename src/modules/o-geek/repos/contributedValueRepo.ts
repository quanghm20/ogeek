import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContributedValue } from '../domain/contributedValue';
import { DomainId } from '../domain/domainId';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ContributedValueMap } from '../mappers/contributedValueMap';

export interface IContributedValueRepo {
    findById(contributedValueId: DomainId | number): Promise<ContributedValue>;
    findOne(
        valueStreamId: number,
        expertiseScopeId: number,
    ): Promise<ContributedValue>;
    findAll(): Promise<ContributedValue[]>;
}

@Injectable()
export class ContributedValueRepository implements IContributedValueRepo {
    constructor(
        @InjectRepository(ContributedValue)
        protected repo: Repository<ContributedValueEntity>,
    ) {}
    async findOne(
        valueStreamId?: number,
        expertiseScopeId?: number,
    ): Promise<ContributedValue> {
        const contributedValue = await this.repo.findOne({
            where: {
                valueStream: { id: valueStreamId },
                expertiseScope: { id: expertiseScopeId },
            },
        });
        return contributedValue
            ? ContributedValueMap.toDomain(contributedValue)
            : null;
    }

    async findById(
        contributedValueId: DomainId | number,
    ): Promise<ContributedValue> {
        contributedValueId =
            contributedValueId instanceof DomainId
                ? Number(contributedValueId.id.toValue())
                : contributedValueId;
        const entity = await this.repo.findOne(contributedValueId);
        return entity ? ContributedValueMap.toDomain(entity) : null;
    }
    async findAll(): Promise<ContributedValue[]> {
        const entity = await this.repo.find();
        return entity ? ContributedValueMap.toDomainAll(entity) : null;
    }
}

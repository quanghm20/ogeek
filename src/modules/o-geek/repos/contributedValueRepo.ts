import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContributedValue } from '../domain/contributedValue';
import { DomainId } from '../domain/domainId';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ContributedValueMap } from '../mappers/contributedValueMap';

export interface IContributedValueRepo {
    findById(contributedValueId: DomainId | number): Promise<ContributedValue>;
    findByExpertiseScopeAndValueStream(
        expertiseScopeId: DomainId | number,
        valueStreamId: DomainId | number,
    ): Promise<ContributedValue>;
}

@Injectable()
export class ContributedValueRepository implements IContributedValueRepo {
    constructor(
        @InjectRepository(ContributedValue)
        protected repo: Repository<ContributedValueEntity>,
    ) {}

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

    async findByExpertiseScopeAndValueStream(
        expertiseScopeId: DomainId | number,
        valueStreamId: DomainId | number,
    ): Promise<ContributedValue> {
        expertiseScopeId =
            expertiseScopeId instanceof DomainId
                ? Number(expertiseScopeId.id.toValue())
                : expertiseScopeId;
        valueStreamId =
            valueStreamId instanceof DomainId
                ? Number(valueStreamId.id.toValue())
                : valueStreamId;

        const entity = await this.repo.findOne({
            where: {
                expertiseScope: { id: expertiseScopeId },
                valueStream: { id: valueStreamId },
            },
            join: {
                alias: 'contributed_value',
                leftJoinAndSelect: {
                    expertiseScope: 'contributed_value.expertiseScope',
                    valueStream: 'contributed_value.valueStream',
                },
            },
        });
        return entity ? ContributedValueMap.toDomain(entity) : null;
    }
}

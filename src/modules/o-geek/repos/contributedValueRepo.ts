import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContributedValue } from '../domain/contributedValue';
import { DomainId } from '../domain/domainId';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ContributedValueMap } from '../mappers/contributedValueMap';

export interface IContributedValueRepo {
    findById(contributedValueId: DomainId | number): Promise<ContributedValue>;
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
}

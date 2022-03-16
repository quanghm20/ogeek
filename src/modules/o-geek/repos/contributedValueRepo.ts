import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { ContributedValue } from '../domain/contributedValue';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ContributedValueMap } from '../mappers/contributedValueMap';

export interface IContributedValueRepo {
    getCommittedWorkload(id: UniqueEntityID): Promise<ContributedValue>;
}

@Injectable()
export class ContributedValueRepository implements IContributedValueRepo {
    constructor(
        @InjectRepository(ContributedValueEntity)
        protected contributedValueRepo: Repository<ContributedValueEntity>,
    ) {}

    // Check correction of data type, if it is number, force it to be DomainId
    async getCommittedWorkload(
        contributedValueId: DomainId | number,
    ): Promise<ContributedValue> {
        // contributedValueId = committedWorkloadId instanceof DomainId ? committedWorkloadId.id.

        const entity = await this.contributedValueRepo.findOne(
            contributedValueId,
        );
        return entity ? ContributedValueMap.toDomain(entity) : null;
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommittedWorkload } from '../domain/committedWorkload';
import { DomainId } from '../domain/domainId';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { CommittedWorkloadMap } from '../mappers/committedWorkloadMap';

export interface ICommittedWorkloadRepo {
    findById(
        committedWorkloadId: DomainId | number,
    ): Promise<CommittedWorkload>;
    save(
        committedWorkload: CommittedWorkloadEntity,
    ): Promise<CommittedWorkload>;
}

@Injectable()
export class CommittedWorkloadRepository implements ICommittedWorkloadRepo {
    constructor(
        @InjectRepository(CommittedWorkloadEntity)
        protected repo: Repository<CommittedWorkloadEntity>,
        @InjectRepository(ContributedValueEntity)
        protected repoContributed: Repository<ContributedValueEntity>,
    ) {}

    async findById(
        committedWorkloadId: DomainId | number,
    ): Promise<CommittedWorkload> {
        committedWorkloadId =
            committedWorkloadId instanceof DomainId
                ? Number(committedWorkloadId.id.toValue())
                : committedWorkloadId;
        const entity = await this.repo.findOne(committedWorkloadId);
        return entity ? CommittedWorkloadMap.toDomain(entity) : null;
    }
    async save(
        committedWorkload: CommittedWorkloadEntity,
    ): Promise<CommittedWorkload> {
        const entity = await this.repo.save(committedWorkload);
        return entity ? CommittedWorkloadMap.toDomain(entity) : null;
    }
}

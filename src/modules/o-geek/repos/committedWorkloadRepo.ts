import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommittedWorkload } from '../domain/committedWorkload';
import { DomainId } from '../domain/domainId';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { CommittedWorkloadShortDto } from '../infra/dtos/createCommittedWorkload/committedWorkloadShort.dto';
import { CommittedWorkloadMap } from '../mappers/committedWorkloadMap';

export interface ICommittedWorkloadRepo {
    findById(
        committedWorkloadId: DomainId | number,
    ): Promise<CommittedWorkload>;
    save(
        committedWorkload: CommittedWorkloadShortDto,
        picId: number,
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
        committedWorkload: CommittedWorkloadShortDto,
        picId: number,
    ): Promise<CommittedWorkload> {
        const entity = await this.repo.save({
            user: { id: committedWorkload.userId },
            contributedValue: {
                expertiseScope: { id: committedWorkload.expertiseScopeId },
                valueStream: { id: committedWorkload.valueStreamId },
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            committedWorkload: committedWorkload.committedWorkload,
            startDate: committedWorkload.startDate,
            expiredDate: committedWorkload.expiredDate,
            picId: { id: picId },
        });
        return entity ? CommittedWorkloadMap.toDomain(entity) : null;
    }
}

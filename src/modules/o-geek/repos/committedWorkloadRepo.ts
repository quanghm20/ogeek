import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommittedWorkload } from '../domain/committedWorkload';
import { DomainId } from '../domain/domainId';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { CommittedWorkloadMap } from '../mappers/committedWorkloadMap';

export interface ICommittedWorkloadRepo {
    findByUserId(userId: DomainId | number): Promise<CommittedWorkload>;
}

@Injectable()
export class CommittedWorkloadRepository implements ICommittedWorkloadRepo {
    constructor(
        @InjectRepository(CommittedWorkload)
        protected repo: Repository<CommittedWorkloadEntity>,
    ) {}

    async findByUserId(userId: DomainId | number): Promise<CommittedWorkload> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.findOne(userId);
        return entity ? CommittedWorkloadMap.toDomain(entity) : null;
    }
}

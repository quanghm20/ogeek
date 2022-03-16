import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { PlannedWorkloadMap } from '../mappers/plannedWorkloadMap';

export interface IPlannedWorkloadRepo {
    findByUserId(userId: DomainId | number): Promise<PlannedWorkload>;
}

@Injectable()
export class PlannedWorkloadRepository implements IPlannedWorkloadRepo {
    constructor(
        @InjectRepository(PlannedWorkload)
        protected repo: Repository<PlannedWorkloadEntity>,
    ) {}

    async findByUserId(userId: DomainId | number): Promise<PlannedWorkload> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.findOne(userId);
        return entity ? PlannedWorkloadMap.toDomain(entity) : null;
    }
}

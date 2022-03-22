import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { PlannedWorkloadMap } from '../mappers/plannedWorkloadMap';

export interface IPlannedWorkloadRepo {
    findByUserId(
        userId: DomainId | number,
        startDateOfYear: string,
        endDateOfYear: string,
    ): Promise<PlannedWorkload[]>;
}

@Injectable()
export class PlannedWorkloadRepository implements IPlannedWorkloadRepo {
    constructor(
        @InjectRepository(PlannedWorkloadEntity)
        protected repo: Repository<PlannedWorkloadEntity>,
    ) {}

    async findByUserId(
        userId: DomainId | number,
        startDateOfYear: string,
        endDateOfYear: string,
    ): Promise<PlannedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.find({
            where: {
                user: { id: userId },
                startDate: Between(startDateOfYear, endDateOfYear),
            },
            relations: [
                'committedWorkload',
                'committedWorkload.contributedValue',
                'contributedValue',
            ],
        });
        return entity ? PlannedWorkloadMap.toArrayDomain(entity) : null;
    }
}

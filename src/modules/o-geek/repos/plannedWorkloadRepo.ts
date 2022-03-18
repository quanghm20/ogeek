import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { WorkloadStatus } from '../../../common/constants/committed-status';
import { DomainId } from '../domain/domainId';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { InputGetPlanWLDto } from '../infra/dtos/ValueStreamsByWeek/inputGetPlanWL.dto';
import { PlannedWorkloadMap } from '../mappers/plannedWorkloadMap';

export interface IPlannedWorkloadRepo {
    findById(plannedWorkloadId: DomainId | number): Promise<PlannedWorkload>;
    findByUserId({
        userId,
        startDateOfWeek,
        endDateOfWeek,
    }: InputGetPlanWLDto): Promise<PlannedWorkload[]>;
}

@Injectable()
export class PlannedWorkloadRepository implements IPlannedWorkloadRepo {
    constructor(
        @InjectRepository(PlannedWorkloadEntity)
        protected repo: Repository<PlannedWorkloadEntity>,
    ) {}

    async findById(
        plannedWorkloadId: DomainId | number,
    ): Promise<PlannedWorkload> {
        plannedWorkloadId =
            plannedWorkloadId instanceof DomainId
                ? Number(plannedWorkloadId.id.toValue())
                : plannedWorkloadId;
        const entity = await this.repo.findOne(plannedWorkloadId);
        return entity ? PlannedWorkloadMap.toDomain(entity) : null;
    }

    async findByUserId({
        startDateOfWeek,
        endDateOfWeek,
        userId,
    }: InputGetPlanWLDto): Promise<PlannedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                status: WorkloadStatus.ACTIVE,
                user: userId,
                startDate: MoreThanOrEqual(startDateOfWeek),
                createdAt: LessThanOrEqual(endDateOfWeek),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
            ],
        });
        // const entity = await this.repo.findOne({
        //     order: {
        //         createdAt: 'DESC',
        //     },
        // });
        // console.log(entities);
        // console.log(entity);

        return entities ? PlannedWorkloadMap.toDomainAll(entities) : null;
    }
}

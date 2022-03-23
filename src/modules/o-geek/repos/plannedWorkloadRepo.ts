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

    // findQueryBuilder(
    //     userId: DomainId | number,
    //     startDateOfYear: string,
    //     endDateOfYear: string,
    // ): Promise<void>;
}

@Injectable()
export class PlannedWorkloadRepository implements IPlannedWorkloadRepo {
    constructor(
        @InjectRepository(PlannedWorkloadEntity)
        protected repo: Repository<PlannedWorkloadEntity>,
    ) {}

    // async findQueryBuilder(
    //     userId: DomainId | number,
    //     startDateOfYear: string,
    //     endDateOfYear: string,
    // ): Promise<void> {
    //     const entity = await this.repo
    //         .createQueryBuilder('plan')
    //         .select(
    //             'SUM(plan.plannedWorkload), plan.user.id, plan.contributedValue.id, plan.committedWorkload.id',
    //         )
    //         .groupBy(
    //             'plan.user.id, plan.contributedValue.id, plan.committedWorkload.id',
    //         )
    //         .innerJoin('plan.user', 'user')
    //         .innerJoin('plan.contributedValue', 'contributedValue')
    //         .innerJoin('plan.committedWorkload', 'committedWorkload')
    //         .where('user.id = :userId', { userId })
    //         .andWhere('plan.startDate BETWEEN :startDate AND :endDate', {
    //             startDateOfYear,
    //             endDateOfYear,
    //         })
    //         .getRawMany();
    //     console.log(entity);
    // }

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
                'contributedValue',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.valueStream',
                'committedWorkload.contributedValue.expertiseScope',
            ],
            // SELECT "user_id", "contributed_value_id", "committed_workload_id", SUM ("planned_workload")
            // FROM "planned_workload" WHERE "user_id" = 1 AND "start_date" BETWEEN '2022-01-01' AND '2022-12-31'
            // GROUP BY "user_id", "contributed_value_id", "committed_workload_id"
        });

        return entity ? PlannedWorkloadMap.toArrayDomain(entity) : null;
    }
}

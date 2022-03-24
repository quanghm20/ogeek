import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { ExpertiseScope } from '../domain/expertiseScope';
import { ExpertiseScopeEntity } from '../infra/database/entities/expertiseScope.entity';
import { InputGetOverviewChartDataDto } from '../infra/dtos/OverviewChartDto/inputGetOverviewChartData.dto';
import { ExpertiseScopeMap } from '../mappers/expertiseScopeMap';
import { MomentService } from '../useCases/moment/configMomentService/ConfigMomentService';

export interface IExpertiseScopeRepo {
    findById(expertiseScopeId: DomainId | number): Promise<ExpertiseScope>;
}

@Injectable()
export class ExpertiseScopeRepository implements IExpertiseScopeRepo {
    constructor(
        @InjectRepository(ExpertiseScopeEntity)
        protected repo: Repository<ExpertiseScopeEntity>,
    ) {}

    async findById(
        expertiseScopeId: DomainId | number,
    ): Promise<ExpertiseScope> {
        expertiseScopeId =
            expertiseScopeId instanceof DomainId
                ? Number(expertiseScopeId.id.toValue())
                : expertiseScopeId;
        const entity = await this.repo.findOne(expertiseScopeId);
        return entity ? ExpertiseScopeMap.toDomain(entity) : null;
    }

    async findByIdWithTimeRange({
        userId,
        startDateInWeek,
    }: InputGetOverviewChartDataDto): Promise<ExpertiseScope[]> {
        const entities = await this.repo.find({
            where: {
                user: userId,
                startDate:
                    MoreThanOrEqual(
                        MomentService.shiftFirstDateChart(startDateInWeek),
                    ) &&
                    LessThanOrEqual(
                        MomentService.shiftLastDateChart(startDateInWeek),
                    ),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
            ],
        });
        return entities
            ? ExpertiseScopeMap.toDomainAll(entities)
            : new Array<ExpertiseScope>();
    }
}

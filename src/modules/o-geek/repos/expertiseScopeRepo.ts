import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { ExpertiseScope } from '../domain/expertiseScope';
import { ExpertiseScopeEntity } from '../infra/database/entities/expertiseScope.entity';
import { ExpertiseScopeMap } from '../mappers/expertiseScopeMap';

export interface IExpertiseScopeRepo {
    findById(expertiseScopeId: DomainId | number): Promise<ExpertiseScope>;
}

@Injectable()
export class ExpertiseScopeRepository implements IExpertiseScopeRepo {
    constructor(
        @InjectRepository(ExpertiseScope)
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
}

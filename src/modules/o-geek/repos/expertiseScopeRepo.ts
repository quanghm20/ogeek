// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
// import { ExpertiseScope } from '../domain/expertiseScope';
// import { ExpertiseScopeMap } from '../domain/expertiseScopeMap';
// import { ExpertiseScopeEntity } from '../infra/database/entities/expertiseScope.entity';

// export interface IExpertiseScopeRepo {
//     getExpertiseScope(id: UniqueEntityID): Promise<ExpertiseScope>;
// }

// @Injectable()
// export class ExpertiseScopeRepository implements IExpertiseScopeRepo {
//     constructor(
//         @InjectRepository(ExpertiseScopeEntity)
//         protected expertiseScopeRepo: Repository<ExpertiseScopeEntity>,
//     ) {}

//     // Check correction of data type, if it is number, force it to be DomainId
//     async getCommittedWorkload(
//         expertiseScopeId: DomainId | number,
//     ): Promise<ExpertiseScope> {
//         // committedWorkloadId = committedWorkloadId instanceof DomainId ? committedWorkloadId.id.

//         const entity = await this.expertiseScopeRepo.findOne(expertiseScopeId);
//         return entity ? ExpertiseScopeMap.toDomain(entity) : null;
//     }
// }

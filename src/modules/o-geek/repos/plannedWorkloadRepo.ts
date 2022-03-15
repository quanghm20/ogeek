// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
// import { PlannedWorkload } from '../domain/plannedWorkload';
// import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
// import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
// import { PlannedWorkloadMap } from '../mappers/plannedWorkloadMap';

// export interface IPlannedWorkloadRepo {
//     getPlannedWorkload(id: UniqueEntityID): Promise<PlannedWorkload>;
// }

// @Injectable()
// export class PlannedWorkloadRepository implements IPlannedWorkloadRepo {
//     constructor(
//         @InjectRepository(PlannedWorkloadEntity)
//         protected plannedWorkloadRepo: Repository<PlannedWorkloadEntity>,
//     ) {}

//     async getPlannedWorkload(id: UniqueEntityID): Promise<PlannedWorkload> {
//         const entity = await this.plannedWorkloadRepo.findOne(id?: UniqueEntityID, );
//         return entity ? PlannedWorkloadMap.toDomain(entity) : null;
//     }
// }

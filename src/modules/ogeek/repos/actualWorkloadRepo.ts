// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
// import { actual}

// export interface ICommittedWorkloadRepo {
//     getCommittedWorkload(id: UniqueEntityID): Promise<CommittedWorkload>;
// }

// @Injectable()
// export class CommittedWorkloadRepository implements ICommittedWorkloadRepo {
//     constructor(
//         @InjectRepository(CommittedWorkloadEntity)
//         protected committedWorkloadRepo: Repository<CommittedWorkloadEntity>,
//     ) {}

//     // Check correction of data type, if it is number, force it to be DomainId
//     async getCommittedWorkload(
//         committedWorkloadId: DomainId | number,
//     ): Promise<CommittedWorkload> {
//         // committedWorkloadId = committedWorkloadId instanceof DomainId ? committedWorkloadId.id.

//         const entity = await this.committedWorkloadRepo.findOne(
//             committedWorkloadId,
//         );
//         return entity ? CommittedWorkloadMap.toDomain(entity) : null;
//     }
// }

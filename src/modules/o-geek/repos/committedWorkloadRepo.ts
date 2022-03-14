// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { CommittedWorkload } from '../domain/committedWorkload';
// import { CommittedWorkloadId } from '../domain/committedWorkloadId';
// import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';

// export interface ICommittedWorkloadRepo {
//     getCommittedWorkload(
//         id: CommittedWorkloadId | number,
//     ): Promise<CommittedWorkload>;
// }

// @Injectable()
// export class CommittedWorkloadRepository implements ICommittedWorkloadRepo {
//     constructor(
//         @InjectRepository(CommittedWorkloadEntity)
//         protected committedWorkloadRepo: Repository<CommittedWorkloadEntity>,
//     ) {}

//     async getCommittedWorkload(
//         committedWorkload: CommittedWorkloadDto,
//     ): Promise<CommittedWorkload> {
//         // const result = this.committedWorkloadRepo.
//         const entity = await this.repo.findOne(CommittedWorkloadId);
//         return entity ? committedWorkloadId.toDomain(entity) : null;
//     }
// }

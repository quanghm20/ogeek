// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { CommittedWorkload } from '../domain/committedWorkload';
// import { CommittedWorkloadId } from '../domain/committedWorkloadId';
// import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';

// export interface CommittedWorkloadRepo {
//     findById(id: CommittedWorkloadId | number): Promise<CommittedWorkload>;
// }

// @Injectable()
// export class CommittedWorkloadRepository implements CommittedWorkloadRepo {
//     constructor(
//         @InjectRepository(CommittedWorkloadEntity)
//         protected repo: Repository<CommittedWorkloadEntity>,
//     ) {}

//     async findById(
//         committedWorkloadId: CommittedWorkloadId | number,
//     ): Promise<CommittedWorkload> {
//         committedWorkloadId =
//             committedWorkloadId instanceof CommittedWorkloadId
//                 ? committedWorkloadId.id.toValue()
//                 : committedWorkloadId;
//         const entity = await this.repo.findOne(CommittedWorkloadId);
//         return entity ? committedWorkloadId.toDomain(entity) : null;
//     }
// }

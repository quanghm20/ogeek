// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { getManager } from 'typeorm';

// import { CommittedWorkload } from '../domain/committedWorkload';
// import { DomainId } from '../domain/domainId';
// // import { User } from '../domain/user';
// import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
// import { CommittedWorkloadMap } from '../mappers/committedWorkloadMap';

// export interface ICommittedWorkloadRepo {
//     findById(
//         committedWorkloadId: DomainId | number,
//     ): Promise<CommittedWorkload>;
// }

// @Injectable()
// export class CommittedWorkloadRepository implements ICommittedWorkloadRepo {
//     constructor(
//         @InjectRepository(CommittedWorkloadEntity)
//         protected repo: Repository<CommittedWorkloadEntity>,
//     ) {}

//     async findById(
//         committedWorkloadId: DomainId | number,
//     ): Promise<CommittedWorkload> {
//         committedWorkloadId =
//             committedWorkloadId instanceof DomainId
//                 ? Number(committedWorkloadId.id.toValue())
//                 : committedWorkloadId;
//         const entity = await this.repo.findOne(committedWorkloadId);
//         return entity ? CommittedWorkloadMap.toDomain(entity) : null;
//     }

//     async findByUserId(userId: DomainId | number): Promise<CommittedWorkload> {
//         // const entity = await this.repo.find({
//         //     where: {
//         //         user: { id: userId },
//         //     },
//         //     join: {
//         //         alias: 'committed_workload',
//         //         innerJoinAndSelect: {
//         //             expertise_scope: contributed_value.expertise_scope_id,
//         //             contributedvalue: committed_workload.contributed_value_id,
//         //         },
//         //     },
//         const entityManager = getManager();
//         const entity = await entityManager.query(`
//             SELECT *
//             FROM committed_workload as cwl
//             JOIN committed_workload contributed_value as cv
//             ON contributed_value_id;
//         `);
//         return entity ? CommittedWorkloadMap.toDomainAll(entity) : null;
//     }
// }

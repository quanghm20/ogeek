// import { Entity } from '../../../core/domain/Entity';
// import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
// import { Result } from '../../../core/logic/Result';

// export class CommittedWorkloadId extends Entity<any> {
//     get id(): UniqueEntityID {
//         return this._id;
//     }

//     private constructor(id?: UniqueEntityID) {
//         super(null, id);
//     }

//     public static create(id?: UniqueEntityID): Result<CommittedWorkloadId> {
//         return Result.ok<CommittedWorkloadId>(new CommittedWorkloadId(id));
//     }
// }

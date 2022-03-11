// import { UniqueEntityID } from 'core/domain/UniqueEntityID';
// import { Mapper } from '../../../core/infra/Mapper';
// import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
// import { Profile } from '../domain/profile';
// import { ProfileEntity } from '../infra/database/entities/profile.entity';
// import { ProfileDto } from '../infra/dtos/profile.dto';

// export class ContributeValueMap implements Mapper<any> {
//     public static fromDomain(contributeValue: ContributeValue): ContributeValueDto {
//         return {
//         };
//     }

//     public static toDomain(raw: ContributedValueEntity): ContributeValue {
//         const { id } = raw;

//         const profileOrError = Profile.create(
//             {
//                 createdAt: raw.createdAt,
//                 facebookLink: raw.facebookLink,
//             },
//             new UniqueEntityID(id),
//         );

//         return profileOrError.isSuccess ? profileOrError.getValue() : null;
//     }
// }

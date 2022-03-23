import { InternalServerErrorException } from '@nestjs/common';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { CommittedWorkload } from '../domain/committedWorkload';
// import { ContributedValue } from '../domain/contributedValue';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { AverageCommittedWorkloadDto } from '../infra/dtos/averageCommittedWorkload.dto';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';
import { ContributedValueMap } from './contributedValueMap';

export class CommittedWorkloadMap implements Mapper<CommittedWorkload> {
    public static fromDomain(
        committedWorkload: CommittedWorkload,
    ): CommittedWorkloadDto {
        return {
            id: committedWorkload.id,
            user: committedWorkload.props.user,
            contributedValue: ContributedValueMap.fromDomain(
                committedWorkload.props.contributedValue,
            ),
            committedWorkload: committedWorkload.props.committedWorkload,
            startDate: committedWorkload.props.startDate,
            expiredDate: committedWorkload.props.expiredDate,
            picId: committedWorkload.props.picId,
        };
    }
    public static fromDomainAverageCommittedWorkload(
        committedWorkload: CommittedWorkload,
    ): AverageCommittedWorkloadDto {
        return {
            committedWorkload: committedWorkload.props.committedWorkload,
            expertiseScope:
                committedWorkload.props.contributedValue.expertiseScope.name,
        };
    }

    public static fromDomainAll(
        committedWLs: CommittedWorkload[],
    ): CommittedWorkloadDto[] {
        const arrCommittedWLDto = new Array<CommittedWorkloadDto>();
        committedWLs.forEach((committedWL) => {
            arrCommittedWLDto.push(
                CommittedWorkloadMap.fromDomain(committedWL),
            );
        });
        return arrCommittedWLDto;
    }

    public static toDomain(
        committedWLEntity: CommittedWorkloadEntity,
    ): CommittedWorkload {
        try {
            const { id } = committedWLEntity;

            const committedWorkloadOrError = CommittedWorkload.create(
                {
                    committedWorkload: committedWLEntity.committedWorkload,
                    startDate: committedWLEntity.startDate,
                    expiredDate: committedWLEntity.expiredDate,
                    status: committedWLEntity.status,
                    contributedValue: ContributedValueMap.toDomain(
                        committedWLEntity.contributedValue,
                    ),
                },
                new UniqueEntityID(id),
            );

            return committedWorkloadOrError.isSuccess
                ? committedWorkloadOrError.getValue()
                : null;
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    public static toDomainAll(
        committedWLs: CommittedWorkloadEntity[],
    ): CommittedWorkload[] {
        const arrCommittedWL = new Array<CommittedWorkload>();
        committedWLs.forEach((committedWL) => {
            const committedOrError = CommittedWorkloadMap.toDomain(committedWL);
            if (committedOrError) {
                arrCommittedWL.push(committedOrError);
            } else {
                return null;
            }
        });
        return arrCommittedWL;
    }
    public static toDomainAll(
        raws: CommittedWorkloadEntity[],
    ): CommittedWorkload[] {
        const committedWorkloadsOrError = [] as CommittedWorkload[];

        if (raws.length === 0) {
            return committedWorkloadsOrError;
        }
        for (const raw of raws) {
            const { id } = raw;
            const committedWorkloadOrError = CommittedWorkload.create(
                {
                    startDate: raw.startDate,
                    expiredDate: raw.expiredDate,
                    committedWorkload: raw.committedWorkload,
                },
                new UniqueEntityID(id),
            );
            if (!committedWorkloadOrError.isSuccess) {
                return null;
            }
            committedWorkloadsOrError.push(committedWorkloadOrError.getValue());
        }
        return committedWorkloadsOrError;
    }
}

// public static toDomainAll(
//     raw: CommittedWorkloadEntity[],
// ): CommittedWorkload[] {
//     const committedWorkloadsOrError = Array<CommittedWorkload>();
//     raw.forEach(function get(item) {
//         const { id } = item;

//         const committedWorkloadId = item.committedWorkload;
//         const committedWorkload = CommittedWorkload.create(
//             {
//                 contributedValue: ContributedValueMap.toDomain(
//                     item.contributedValue,
//                 ),
//                 user: UserMap.toDomain(item.user),
//                 committedWorkload: item.committedWorkload,
//                 startDate: item.startDate,
//                 expiredDate: item.startDate,
//                 status: item.status,
//                 createdAt: item.createdAt,
//                 updatedAt: item.updatedAt,
//             },
//             new UniqueEntityID(committedWorkloadId),
//         );

//         const expertiseScopeId = item.contributedValue.expertiseScope.id;
//         const expertiseScope = ExpertiseScope.create(
//             {
//                 name: item.contributedValue.expertiseScope.name,
//                 createdAt: item.contributedValue.expertiseScope.createdAt,
//                 updatedAt: item.contributedValue.expertiseScope.updatedAt,
//             },
//             new UniqueEntityID(expertiseScopeId),
//         );

//         const committedWorkloadOrError = CommittedWorkload.create(
//             {
//                 createdAt: item.createdAt,
//                 updatedAt: item.updatedAt,
//                 committedWorkload: item.committedWorkload,
//                 startDate: item.startDate,
//                 expiredDate: item.expiredDate,
//             },
//             new UniqueEntityID(id),
//         );
//         committedWorkloadOrError.getValue().committedWorkload =
//             committedWorkload.getValue();
//         committedWorkloadOrError.getValue().contributedValue.expertiseScope =
//             expertiseScope.getValue();
//         committedWorkloadsOrError.push(committedWorkload.getValue());
//     });
//     return committedWorkloadsOrError ? committedWorkloadsOrError : null;
// }

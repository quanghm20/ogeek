import { InternalServerErrorException } from '@nestjs/common';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { CommittedWorkload } from '../domain/committedWorkload';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
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

    public static toDomainOverview(
        raw: CommittedWorkloadEntity,
    ): CommittedWorkload {
        const { id } = raw;
        const committedWorkloadOrError = CommittedWorkload.create(
            {
                contributedValue: ContributedValueMap.toDomain(
                    raw.contributedValue,
                ),
                committedWorkload: raw.committedWorkload,
                startDate: raw.startDate,
                expiredDate: raw.expiredDate,
                status: raw.status,
            },
            new UniqueEntityID(id),
        );
        return committedWorkloadOrError.isSuccess
            ? committedWorkloadOrError.getValue()
            : null;
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

    public static toArrayDomain(
        raws: CommittedWorkloadEntity[],
    ): CommittedWorkload[] {
        const committedWorkloadsOrError = Array<CommittedWorkload>();
        raws.forEach(function get(item) {
            const committedWorkloadOrError =
                CommittedWorkloadMap.toDomain(item);
            committedWorkloadsOrError.push(committedWorkloadOrError);
        });
        return committedWorkloadsOrError ? committedWorkloadsOrError : null;
    }
}

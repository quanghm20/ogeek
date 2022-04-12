import { InternalServerErrorException } from '@nestjs/common';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { CommittedWorkload } from '../domain/committedWorkload';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';
import { CommittedWorkloadShortDto } from '../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { ContributedValueMap } from './contributedValueMap';
import { ExpertiseScopeMap } from './expertiseScopeMap';
import { UserMap } from './userMap';
import { ValueStreamMap } from './valueStreamMap';

export class CommittedWorkloadMap implements Mapper<CommittedWorkload> {
    public static fromDomain(
        committedWorkload: CommittedWorkload,
    ): CommittedWorkloadDto {
        const dto = new CommittedWorkloadDto();
        dto.id = committedWorkload.id;
        dto.user = UserMap.fromDomain(committedWorkload.props.user);
        dto.contributedValue = committedWorkload.props.contributedValue
            ? ContributedValueMap.fromDomain(
                  committedWorkload.props.contributedValue,
              )
            : null;
        dto.committedWorkload = committedWorkload.props.committedWorkload;
        dto.startDate = committedWorkload.props.startDate;
        dto.expiredDate = committedWorkload.props.expiredDate;
        dto.createdBy = committedWorkload.props.createdBy;
        dto.createdAt = committedWorkload.props.createdAt;
        dto.updatedAt = committedWorkload.props.updatedAt;
        return dto;
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
    public static toEntity(
        committedWorkload: CommittedWorkload,
    ): CommittedWorkloadEntity {
        const user = UserMap.toEntity(committedWorkload.user);

        const contributedValue = ContributedValueMap.toEntity(
            committedWorkload.contributedValue,
        );
        const id =
            Number(committedWorkload.committedWorkloadId?.id?.toValue()) ||
            null;
        const entity = new CommittedWorkloadEntity(
            id,
            user,
            contributedValue,
            committedWorkload.committedWorkload,
            committedWorkload.startDate,
            committedWorkload.expiredDate,
        );
        entity.contributedValue = ContributedValueMap.toEntity(
            committedWorkload.contributedValue,
        );
        entity.status = committedWorkload.status;

        entity.createdAt = committedWorkload.createdAt;
        entity.createdBy = committedWorkload.createdBy;
        entity.updatedAt = committedWorkload.updatedAt;
        entity.updatedBy = committedWorkload.updatedBy;
        entity.deletedAt = committedWorkload.deletedAt;
        entity.deletedBy = committedWorkload.deletedBy;

        return entity;
    }
    public static toEntities(
        committedWorkload: CommittedWorkload[],
    ): CommittedWorkloadEntity[] {
        const committedEntities = new Array<CommittedWorkloadEntity>();
        for (const commit of committedWorkload) {
            committedEntities.push(this.toEntity(commit));
        }
        return committedEntities;
    }

    public static fromDomainAll(
        committedWLs: CommittedWorkload[],
    ): CommittedWorkloadDto[] {
        const arrCommittedWLDto = new Array<CommittedWorkloadDto>();
        committedWLs.forEach((committedWL) => {
            arrCommittedWLDto.push(this.fromDomain(committedWL));
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
                    contributedValue: committedWLEntity.contributedValue
                        ? ContributedValueMap.toDomain(
                              committedWLEntity.contributedValue,
                          )
                        : null,
                    user: committedWLEntity.user
                        ? UserMap.toDomain(committedWLEntity.user)
                        : null,
                    createdBy: committedWLEntity.createdBy,
                    updatedBy: committedWLEntity.updatedBy,
                    createdAt: committedWLEntity.createdAt,
                    updatedAt: committedWLEntity.updatedAt,
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
            const committedOrError = this.toDomain(committedWL);
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

    public static fromCommittedWorkloadShort(
        committedDomain: CommittedWorkload,
    ): CommittedWorkloadShortDto {
        try {
            const committed = new CommittedWorkloadShortDto();
            committed.id = Number(committedDomain.id.toString());
            committed.user = UserMap.fromUserShort(committedDomain.user);
            committed.expertiseScope = ExpertiseScopeMap.fromDomainShort(
                committedDomain.contributedValue.expertiseScope,
            );
            committed.valueStream = ValueStreamMap.fromDomainShort(
                committedDomain.contributedValue.valueStream,
            );
            committed.committedWorkload = committedDomain.committedWorkload;
            committed.startDate = committedDomain.startDate;
            committed.expiredDate = committedDomain.expiredDate;
            committed.status = committedDomain.status;
            committed.createdAt = committedDomain.createdAt;

            return committed;
        } catch (error) {
            return null;
        }
    }

    public static fromCommittedWorkloadShortArray(
        committees: CommittedWorkload[],
    ): CommittedWorkloadShortDto[] {
        const commits = Array<CommittedWorkloadShortDto>();
        for (const commit of committees) {
            commits.push(this.fromCommittedWorkloadShort(commit));
        }
        return commits;
    }
}

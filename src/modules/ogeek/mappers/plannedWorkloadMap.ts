import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
import { CommittedWorkloadMap } from './committedWorkloadMap';
import { ContributedValueMap } from './contributedValueMap';
import { UserMap } from './userMap';

export class PlannedWorkloadMap implements Mapper<PlannedWorkload> {
    public static fromDomain(
        plannedWorkload: PlannedWorkload,
    ): PlannedWorkloadDto {
        return {
            id: plannedWorkload.id,
            user: UserMap.fromDomain(plannedWorkload.props.user),
            contributedValue: ContributedValueMap.fromDomain(
                plannedWorkload.props.contributedValue,
            ),
            committedWorkload: CommittedWorkloadMap.fromDomain(
                plannedWorkload.props.committedWorkload,
            ),
            plannedWorkload: plannedWorkload.props.plannedWorkload,
            startDate: plannedWorkload.props.startDate,
            status: plannedWorkload.props.status,
        };
    }

    public static fromDomainList(
        plannedWorkloadList: PlannedWorkload[],
    ): PlannedWorkloadDto[] {
        return plannedWorkloadList.map((plannedWL) =>
            this.fromDomain(plannedWL),
        );
    }

    public static fromDomainAll(
        plannedWLs: PlannedWorkload[],
    ): PlannedWorkloadDto[] {
        const arrPlannedWLDto = new Array<PlannedWorkloadDto>();
        plannedWLs.forEach((plannedWL) => {
            arrPlannedWLDto.push(PlannedWorkloadMap.fromDomain(plannedWL));
        });
        return arrPlannedWLDto;
    }

    public static toDomain(raw: PlannedWorkloadEntity): PlannedWorkload {
        const { id } = raw;
        const plannedWorkloadOrError = PlannedWorkload.create(
            {
                user: UserMap.toDomain(raw.user),
                plannedWorkload: raw.plannedWorkload,
                startDate: raw.startDate,
                status: raw.status,
                reason: raw.reason,
                contributedValue: ContributedValueMap.toDomain(
                    raw.contributedValue,
                ),
                committedWorkload: CommittedWorkloadMap.toDomain(
                    raw.committedWorkload,
                ),
                createdBy: raw.createdBy,
                updatedBy: raw.updatedBy,
                deletedBy: raw.deletedBy,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
                deletedAt: raw.deletedAt,
            },
            new UniqueEntityID(id),
        );
        return plannedWorkloadOrError.isSuccess
            ? plannedWorkloadOrError.getValue()
            : null;
    }

    public static toEntity(
        plannedWorkload: PlannedWorkload,
    ): PlannedWorkloadEntity {
        const id =
            Number(plannedWorkload.plannedWorkloadId?.id?.toValue()) || null;
        const entity = new PlannedWorkloadEntity(id);
        entity.status = plannedWorkload.status;
        entity.user = UserMap.toEntity(plannedWorkload.user);
        entity.reason = plannedWorkload.reason;
        entity.startDate = plannedWorkload.startDate;
        entity.plannedWorkload = plannedWorkload.plannedWorkload;
        entity.contributedValue = ContributedValueMap.toEntity(
            plannedWorkload.contributedValue,
        );
        entity.committedWorkload = CommittedWorkloadMap.toEntity(
            plannedWorkload.committedWorkload,
        );

        entity.createdAt = plannedWorkload.createdAt;
        entity.createdBy = plannedWorkload.createdBy;
        entity.updatedAt = plannedWorkload.updatedAt;
        entity.updatedBy = plannedWorkload.updatedBy;
        entity.deletedAt = plannedWorkload.deletedAt;
        entity.deletedBy = plannedWorkload.deletedBy;

        return entity;
    }
    public static toEntities(
        plannedWorkload: PlannedWorkload[],
    ): PlannedWorkloadEntity[] {
        const entities = new Array<PlannedWorkloadEntity>();
        for (const commit of plannedWorkload) {
            entities.push(this.toEntity(commit));
        }
        return entities;
    }

    public static toArrayDomain(
        raws: PlannedWorkloadEntity[],
    ): PlannedWorkload[] {
        const plannedWorkloadsOrError = Array<PlannedWorkload>();
        raws.forEach(function get(raw) {
            const { id } = raw;
            const plannedWorkloadOrError = PlannedWorkload.create(
                {
                    committedWorkload: CommittedWorkloadMap.toDomain(
                        raw.committedWorkload,
                    ),
                    plannedWorkload: raw.plannedWorkload,
                },
                new UniqueEntityID(id),
            );
            plannedWorkloadsOrError.push(plannedWorkloadOrError.getValue());
        });
        return plannedWorkloadsOrError ? plannedWorkloadsOrError : null;
    }

    public static toDomainAll(
        plannedWLs: PlannedWorkloadEntity[],
    ): PlannedWorkload[] {
        const arrPlannedWL = new Array<PlannedWorkload>();
        plannedWLs.forEach((plannedWL) => {
            const plannedWLOrError = PlannedWorkloadMap.toDomain(plannedWL);
            if (plannedWLOrError) {
                arrPlannedWL.push(plannedWLOrError);
            } else {
                return null;
            }
        });
        return arrPlannedWL;
    }
}

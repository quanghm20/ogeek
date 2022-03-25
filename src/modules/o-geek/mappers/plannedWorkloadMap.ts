import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
import { UserMap } from '../mappers/userMap';
import { CommittedWorkloadMap } from './committedWorkloadMap';
import { ContributedValueMap } from './contributedValueMap';

export class PlannedWorkloadMap implements Mapper<PlannedWorkload> {
    public static fromDomain(
        plannedWorkload: PlannedWorkload,
    ): PlannedWorkloadDto {
        const dto = new PlannedWorkloadDto();
        dto.id = plannedWorkload.id;
        dto.contributedValue = ContributedValueMap.fromDomain(
            plannedWorkload.props.contributedValue,
        );
        dto.committedWorkload = CommittedWorkloadMap.fromDomain(
            plannedWorkload.props.committedWorkload,
        );
        dto.plannedWorkload = plannedWorkload.props.plannedWorkload;
        dto.startDate = plannedWorkload.props.startDate;
        dto.status = plannedWorkload.props.status;
        return dto;
    }

    public static fromDomainList(
        plannedWorkloadList: PlannedWorkload[],
    ): PlannedWorkloadDto[] {
        return plannedWorkloadList.map(
            (plannedWL) =>
                ({
                    id: plannedWL.id,
                    user: plannedWL.props.user,
                    contributedValue: plannedWL.props.contributedValue,
                    committedWorkload: plannedWL.props.committedWorkload,
                    plannedWorkload: plannedWL.props.plannedWorkload,
                    startDate: plannedWL.props.startDate,
                    status: plannedWL.props.status,
                } as PlannedWorkloadDto),
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
                plannedWorkload: raw.plannedWorkload,
                startDate: raw.startDate,
                status: raw.status,
                contributedValue: ContributedValueMap.toDomain(
                    raw.contributedValue,
                ),
                committedWorkload: CommittedWorkloadMap.toDomain(
                    raw.committedWorkload,
                ),
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
        const entity = new PlannedWorkloadEntity();

        entity.status = plannedWorkload.status;
        entity.user = UserMap.toEntity(plannedWorkload.user);
        entity.reason = plannedWorkload.reason;
        entity.startDate = plannedWorkload.startDate;
        entity.plannedWorkload = plannedWorkload.plannedWorkload;

        entity.contributedValue = ContributedValueMap.toEntity(
            plannedWorkload.contributedValue,
        );
        plannedWorkload.committedWorkload.contributedValue =
            plannedWorkload.contributedValue;
        plannedWorkload.committedWorkload.user = plannedWorkload.user;
        entity.committedWorkload = CommittedWorkloadMap.toEntity(
            plannedWorkload.committedWorkload,
        );
        return entity;
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

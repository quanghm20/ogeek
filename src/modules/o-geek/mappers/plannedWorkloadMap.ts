import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';

export class PlannedWorkloadMap implements Mapper<PlannedWorkload> {
    public static fromDomain(
        plannedWorkload: PlannedWorkload,
    ): PlannedWorkloadDto {
        return {
            id: plannedWorkload.id,
            user: plannedWorkload.props.user,
            contributedValue: plannedWorkload.props.contributedValue,
            committedWorkload: plannedWorkload.props.committedWorkload,
            plannedWorkload: plannedWorkload.props.plannedWorkload,
            startDate: plannedWorkload.props.startDate,
            status: plannedWorkload.props.status,
        };
    }

    public static fromDomainAll(
        plannedWorkloads: PlannedWorkload[],
    ): PlannedWorkloadDto[] {
        const listPlannedWorkloadsDto = new Array<PlannedWorkloadDto>();
        plannedWorkloads.forEach((plannedWL) => {
            listPlannedWorkloadsDto.push(
                PlannedWorkloadMap.fromDomain(plannedWL),
            );
        });
        return listPlannedWorkloadsDto;
    }
    public static toDomain(raw: PlannedWorkloadEntity): PlannedWorkload {
        const { id } = raw;
        const plannedWorkloadOrError = PlannedWorkload.create(
            {
                plannedWorkload: raw.plannedWorkload,
                startDate: raw.startDate,
                status: raw.status,
            },
            new UniqueEntityID(id),
        );

        return plannedWorkloadOrError.isSuccess
            ? plannedWorkloadOrError.getValue()
            : null;
    }

    public static toDomainAll(
        plannedWorkloads: PlannedWorkloadEntity[],
    ): PlannedWorkload[] {
        const listPlannedWorkloads = new Array<PlannedWorkload>();
        plannedWorkloads.forEach((plannedWL) => {
            const plannedWorkloadOrError =
                PlannedWorkloadMap.toDomain(plannedWL);
            if (plannedWorkloadOrError) {
                listPlannedWorkloads.push(plannedWorkloadOrError);
            } else {
                return null;
            }
        });

        return listPlannedWorkloads;
    }
}

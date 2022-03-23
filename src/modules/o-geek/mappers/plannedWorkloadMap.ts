import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
import { CommittedWorkloadMap } from './committedWorkloadMap';

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
}

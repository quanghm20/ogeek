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
            userId: plannedWorkload.userId,
            contributedValueId: plannedWorkload.contributedValue,
            committedWorkloadId: plannedWorkload.committedWorkloadId,
            plannedWorkload: plannedWorkload.plannedWorkload,
            startDate: plannedWorkload.startDate,
            isActive: plannedWorkload.isActive,
            reason: plannedWorkload.reason,
        };
    }

    public static toDomain(raw: PlannedWorkloadEntity): PlannedWorkload {
        const { id } = raw;

        const plannedWorkloadOrError = PlannedWorkload.create(
            {
                userId: raw.user.id,
                contributedValueId: raw.contributedValue.id,
                committedWorkloadId: raw.committedWorkload.id,
                plannedWorkload: raw.plannedWorkload,
                startDate: raw.startDate,
                isActive: raw.status,
                // reason: raw.reason,
            },
            new UniqueEntityID(id),
        );
        return plannedWorkloadOrError.isSuccess
            ? plannedWorkloadOrError.getValue()
            : null;
    }
}

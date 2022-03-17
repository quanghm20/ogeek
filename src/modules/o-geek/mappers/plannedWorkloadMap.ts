import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
import { UserMap } from '../mappers/userMap';
import { ContributedValueMap } from './contributedValueMap';

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

    public static toEntity(
        plannedWorkload: PlannedWorkload,
    ): PlannedWorkloadEntity {
        const entity = new PlannedWorkloadEntity();

        entity.id = Number(plannedWorkload.id.toValue());
        entity.status = plannedWorkload.status;
        entity.user = UserMap.toEntity(plannedWorkload.user);
        entity.reason = plannedWorkload.reason;
        entity.contributedValue = ContributedValueMap.toEntity(
            plannedWorkload.contributedValue,
        );

        return entity;
    }

    public static toDomainAll(
        raws: PlannedWorkloadEntity[],
    ): PlannedWorkload[] {
        const plannedWorkloadsOrError = [] as PlannedWorkload[];

        if (raws.length === 0) {
            return plannedWorkloadsOrError;
        }
        for (const raw of raws) {
            const { id } = raw;
            const plannedWorkloadOrError = PlannedWorkload.create(
                {
                    plannedWorkload: raw.plannedWorkload,
                    startDate: raw.startDate,
                    status: raw.status,
                },
                new UniqueEntityID(id),
            );
            if (!plannedWorkloadOrError.isSuccess) {
                return null;
            }
            plannedWorkloadsOrError.push(plannedWorkloadOrError.getValue());
        }
        return plannedWorkloadsOrError;
    }
}

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
                user: UserMap.toDomain(raw.user),
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

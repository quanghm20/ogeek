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
        const plannedWorkladDto = new PlannedWorkloadDto();
        if (plannedWorkload) {
            plannedWorkladDto.id = new UniqueEntityID(
                plannedWorkload.id.toValue(),
            );
            plannedWorkladDto.user = UserMap.fromDomain(
                plannedWorkload.props.user,
            );
            plannedWorkladDto.contributedValue = ContributedValueMap.fromDomain(
                plannedWorkload.props.contributedValue,
            );
            plannedWorkladDto.committedWorkload =
                CommittedWorkloadMap.fromDomain(
                    plannedWorkload.props.committedWorkload,
                );
            plannedWorkladDto.plannedWorkload =
                plannedWorkload.props.plannedWorkload;
            plannedWorkladDto.startDate = plannedWorkload.props.startDate;
            plannedWorkladDto.status = plannedWorkload.props.status;
        }
        return plannedWorkladDto;
    }

    public static fromDomainList(
        plannedWorkloadList: PlannedWorkload[],
    ): PlannedWorkloadDto[] {
        let plannedWorkloadDto = new Array<PlannedWorkloadDto>();
        if (plannedWorkloadList) {
            plannedWorkloadDto = plannedWorkloadList.map((plannedWL) =>
                this.fromDomain(plannedWL),
            );
        }
        return plannedWorkloadDto;
    }

    public static fromDomainAll(
        plannedWLs: PlannedWorkload[],
    ): PlannedWorkloadDto[] {
        const arrPlannedWLDto = new Array<PlannedWorkloadDto>();
        if (plannedWLs) {
            plannedWLs.forEach((plannedWL) => {
                arrPlannedWLDto.push(PlannedWorkloadMap.fromDomain(plannedWL));
            });
        }
        return arrPlannedWLDto;
    }

    public static toDomain(raw: PlannedWorkloadEntity): PlannedWorkload {
        if (!raw) {
            return null;
        }
        const { id } = raw;
        const plannedWorkloadOrError = PlannedWorkload.create(
            {
                user: UserMap.toDomain(raw.user),
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

        if (plannedWorkload) {
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
        }

        return entity;
    }

    public static toArrayDomain(
        raws: PlannedWorkloadEntity[],
    ): PlannedWorkload[] {
        const plannedWorkloadsOrError = Array<PlannedWorkload>();
        if (raws) {
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
        }
        return plannedWorkloadsOrError;
    }

    public static toDomainAll(
        plannedWLs: PlannedWorkloadEntity[],
    ): PlannedWorkload[] {
        const arrPlannedWL = new Array<PlannedWorkload>();
        if (plannedWLs) {
            plannedWLs.forEach((plannedWL) => {
                const plannedWLOrError = PlannedWorkloadMap.toDomain(plannedWL);
                if (plannedWLOrError) {
                    arrPlannedWL.push(plannedWLOrError);
                } else {
                    return null;
                }
            });
        }
        return arrPlannedWL;
    }
}

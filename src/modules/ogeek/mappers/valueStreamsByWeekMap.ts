import { ActualPlanAndWorkLogDto } from '../infra/dtos/actualPlansAndWorkLogs.dto';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';
import { ExpertiseScopeDto } from '../infra/dtos/expertiseScope.dto';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
import { UserDto } from '../infra/dtos/user.dto';
import { ValueStreamDto } from '../infra/dtos/valueStream.dto';
import { ExpertiseScopeWithinValueStreamDto } from '../infra/dtos/valueStreamsByWeek/expertiseScopeWithinValueStream.dto';
import { ValueStreamByWeekDto } from '../infra/dtos/valueStreamsByWeek/valueStream.dto';
import { ValueStreamsByWeekDto } from '../infra/dtos/valueStreamsByWeek/valueStreamsByWeek.dto';

export class ValueStreamsByWeekMap {
    public static addValueStreamEmpty(
        valueStreamByWeekDtos: ValueStreamByWeekDto[],
        valueStreamDtos: ValueStreamDto[],
    ): ValueStreamByWeekDto[] {
        valueStreamDtos.forEach((valueStreamDto) => {
            if (
                !valueStreamByWeekDtos.find(
                    (valueStreamByWeek) =>
                        Number(valueStreamByWeek.id.toString()) ===
                        Number(valueStreamDto.id.toString()),
                )
            ) {
                valueStreamByWeekDtos.push({
                    id: Number(valueStreamDto.id.toString()),
                    name: valueStreamDto.name,
                    expertiseScopes: [],
                } as ValueStreamByWeekDto);
            }
        });
        return valueStreamByWeekDtos;
    }

    public static combineExpertiseScopeWithinValueStreamDtos(
        expertiseScopeWithinValueStreamDtos: ExpertiseScopeWithinValueStreamDto[],
        expertiseDto: ExpertiseScopeDto,
        committedWLDto: CommittedWorkloadDto,
        plannedWLDtos: PlannedWorkloadDto[],
        actualPlanAndWorkLog: ActualPlanAndWorkLogDto,
    ): ExpertiseScopeWithinValueStreamDto[] {
        const plannedWLFinded = plannedWLDtos.find(
            (planned) =>
                Number(planned.committedWorkload.id.toString()) ===
                Number(committedWLDto.id.toString()),
        );

        const plannedWorkload = plannedWLFinded
            ? plannedWLFinded.plannedWorkload
            : committedWLDto.committedWorkload;

        let actual = 0;

        let worklog = 0;

        if (actualPlanAndWorkLog) {
            actual = actualPlanAndWorkLog.actualPlannedWorkload;
            worklog = actualPlanAndWorkLog.worklog;
        }

        const results = expertiseScopeWithinValueStreamDtos;
        expertiseScopeWithinValueStreamDtos.push({
            worklog,
            plannedWorkload,
            actualPlannedWorkload: actual,
            committedWorkloadId: Number(committedWLDto.id.toString()),
            contributedValueId: Number(
                committedWLDto.contributedValue.id.toString(),
            ),
            committedWorkload: committedWLDto.committedWorkload,
            expertiseScope: {
                id: Number(expertiseDto.id.toString()),
                name: expertiseDto.name,
            },
        } as ExpertiseScopeWithinValueStreamDto);
        return results;
    }

    public static combineAllDto(
        committedWLDtos: CommittedWorkloadDto[],
        plannedWLDtos: PlannedWorkloadDto[],
        actualPlanAndWorkLogDtos: ActualPlanAndWorkLogDto[],
        valueStreamDtos: ValueStreamDto[],
        userDto: UserDto,
        week: number,
        startDateOfWeek: Date,
        endDateOfWeek: Date,
    ): ValueStreamsByWeekDto {
        const valueStreamByWeekDtos = new Array<ValueStreamByWeekDto>();
        committedWLDtos.forEach((committedWLDto) => {
            const valueStreamDto = committedWLDto.contributedValue.valueStream;
            const expertiseDto = committedWLDto.contributedValue.expertiseScope;
            const valueStreamByWeekDto = valueStreamByWeekDtos.find(
                (valueStreamByWeek) =>
                    Number(valueStreamByWeek.id.toString()) ===
                    Number(valueStreamDto.id.toString()),
            );
            const actualPlanAndWorkLog = actualPlanAndWorkLogDtos.find(
                (actualPlan) =>
                    Number(actualPlan.contributedValueId.toString()) ===
                    Number(committedWLDto.contributedValue.id.toString()),
            );
            if (!valueStreamByWeekDto) {
                let expertiseScopeWithinValueStreamDtos =
                    new Array<ExpertiseScopeWithinValueStreamDto>();
                expertiseScopeWithinValueStreamDtos =
                    this.combineExpertiseScopeWithinValueStreamDtos(
                        expertiseScopeWithinValueStreamDtos,
                        expertiseDto,
                        committedWLDto,
                        plannedWLDtos,
                        actualPlanAndWorkLog,
                    );
                valueStreamByWeekDtos.push({
                    id: Number(valueStreamDto.id.toString()),
                    name: valueStreamDto.name,
                    expertiseScopes: expertiseScopeWithinValueStreamDtos,
                } as ValueStreamByWeekDto);
            } else {
                let expertiseScopeWithinValueStreamDtos =
                    valueStreamByWeekDto.expertiseScopes;
                if (!valueStreamByWeekDto.expertiseScopes) {
                    expertiseScopeWithinValueStreamDtos =
                        new Array<ExpertiseScopeWithinValueStreamDto>();
                }
                expertiseScopeWithinValueStreamDtos =
                    this.combineExpertiseScopeWithinValueStreamDtos(
                        expertiseScopeWithinValueStreamDtos,
                        expertiseDto,
                        committedWLDto,
                        plannedWLDtos,
                        actualPlanAndWorkLog,
                    );
                valueStreamByWeekDto.expertiseScopes =
                    expertiseScopeWithinValueStreamDtos;
            }
        });
        ValueStreamsByWeekMap.addValueStreamEmpty(
            valueStreamByWeekDtos,
            valueStreamDtos,
        );
        return {
            week,
            status: plannedWLDtos[0].status,
            startDate: startDateOfWeek,
            endDate: endDateOfWeek,
            valueStreams: valueStreamByWeekDtos,
        } as ValueStreamsByWeekDto;
    }
}
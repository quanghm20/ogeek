import * as moment from 'moment';

import { WeekStatus } from '../../../common/constants/week-status';
import { ActualPlanAndWorkLogDto } from '../infra/dtos/actualPlansAndWorkLogs.dto';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';
import { ExpertiseScopeDto } from '../infra/dtos/expertiseScope.dto';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
import { UserDto } from '../infra/dtos/user.dto';
import { ValueStreamDto } from '../infra/dtos/valueStream.dto';
import { ExpertiseScopeWithinValueStreamDto } from '../infra/dtos/ValueStreamsByWeek/expertiseScopeWithinValueStream.dto';
import { ValueStreamByWeekDto } from '../infra/dtos/ValueStreamsByWeek/valueStream.dto';
import { ValueStreamsByWeekDto } from '../infra/dtos/ValueStreamsByWeek/valueStreamsByWeek.dto';

export class ValueStreamsByWeekMap {
    public static getStatusValueStreamInFuture(
        plannedWLDtos: PlannedWorkloadDto[],
    ): WeekStatus {
        return plannedWLDtos.length > 0
            ? WeekStatus.PLANNED
            : WeekStatus.PLANNING;
    }

    public static getStatusValueStream(
        week: number,
        currentWeek: number,
        plannedWLDtos: PlannedWorkloadDto[],
        userDto: UserDto,
    ): WeekStatus {
        if (currentWeek > week) {
            return WeekStatus.CLOSED;
        }
        if (currentWeek < week) {
            return ValueStreamsByWeekMap.getStatusValueStreamInFuture(
                plannedWLDtos,
            );
        }
        return userDto.weekStatus;
    }

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
            (planned) => planned.committedWorkload.id === committedWLDto.id,
        );

        const plannedWorkload = plannedWLFinded
            ? plannedWLFinded.plannedWorkload
            : committedWLDto.committedWorkload;

        let actual = plannedWorkload;
        let worklog = 0;
        if (actualPlanAndWorkLog) {
            actual = actualPlanAndWorkLog.actualPlan;
            worklog = actualPlanAndWorkLog.worklog;
        }

        const results = expertiseScopeWithinValueStreamDtos;
        expertiseScopeWithinValueStreamDtos.push({
            worklog,
            plannedWorkload,
            committedWorkload: committedWLDto.committedWorkload,
            actualPlannedWorkload: actual,
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
        startDateOfWeek: string,
        endDateOfWeek: string,
    ): ValueStreamsByWeekDto {
        const currentWeek = moment(new Date()).week();
        const status = ValueStreamsByWeekMap.getStatusValueStream(
            week,
            currentWeek,
            plannedWLDtos,
            userDto,
        );
        const valueStreamByWeekDtos = new Array<ValueStreamByWeekDto>();
        committedWLDtos.forEach((committedWLDto) => {
            const valueStreamDto = committedWLDto.contributedValue.valueStream;
            const expertiseDto = committedWLDto.contributedValue.expertiseScope;
            const valueStreamByWeekDto = valueStreamByWeekDtos.find(
                (valueStreamByWeek) =>
                    valueStreamByWeek.id === valueStreamDto.id,
            );
            const actualPlanAndWorkLog = actualPlanAndWorkLogDtos.find(
                (actualPlan) =>
                    actualPlan.contributedValueId ===
                    committedWLDto.contributedValue.id,
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
            status,
            startDate: startDateOfWeek,
            endDate: endDateOfWeek,
            valueStreams: valueStreamByWeekDtos,
        } as ValueStreamsByWeekDto;
    }
}

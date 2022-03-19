import * as moment from 'moment';

import { WeekStatus } from '../../../common/constants/week-status';
import { ActualPlanAndWorkLogDto } from '../infra/dtos/actualPlansAndWorkLogs.dto';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';
import { ExpertiseScopeDto } from '../infra/dtos/expertiseScope.dto';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
import { UserDto } from '../infra/dtos/user.dto';
import { ValueStreamDto } from '../infra/dtos/valueStream.dto';
import { ContributedValueDto } from '../infra/dtos/ValueStreamsByWeek/contributedValue.dto';
import { ValueStreamByWeekDto } from '../infra/dtos/ValueStreamsByWeek/valueStream.dto';
import { ValueStreamsByWeekDto } from '../infra/dtos/ValueStreamsByWeek/valueStreamsByWeek.dto';

export class ValueStreamsByWeekMap {
    public static getStatusValueStreamInFuture(
        plannedWLDtos: PlannedWorkloadDto[],
    ): WeekStatus {
        return plannedWLDtos.length > 0
            ? WeekStatus.PLANNED
            : WeekStatus.PLANING;
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
                        valueStreamByWeek.id.toValue() ===
                        valueStreamDto.id.toValue(),
                )
            ) {
                valueStreamByWeekDtos.push({
                    id: valueStreamDto.id,
                    name: valueStreamDto.name,
                    contributedValues: [],
                } as ValueStreamByWeekDto);
            }
        });
        return valueStreamByWeekDtos;
    }

    public static combineContributedValueDto(
        contributedValueDtos: ContributedValueDto[],
        expertiseDto: ExpertiseScopeDto,
        committedWLDto: CommittedWorkloadDto,
        plannedWLDtos: PlannedWorkloadDto[],
        actualPlanAndWorkLog: ActualPlanAndWorkLogDto,
    ): ContributedValueDto[] {
        const plannedWorkload = plannedWLDtos.find(
            (planned) =>
                planned.committedWorkload.id.toValue() ===
                committedWLDto.id.toValue(),
        );

        const plannedWorkLoad = plannedWorkload
            ? plannedWorkload.plannedWorkload
            : committedWLDto.committedWorkload;

        let actual = plannedWorkLoad;
        let worklog = 0;
        if (actualPlanAndWorkLog) {
            actual = actualPlanAndWorkLog.actualPlan;
            worklog = actualPlanAndWorkLog.worklog;
        }

        const results = contributedValueDtos;
        contributedValueDtos.push({
            worklog,
            plannedWorkLoad,
            expertiseScopeId: Number(expertiseDto.id.toString()),
            expertiseScope: expertiseDto.name,
            committedWorkLoad: committedWLDto.committedWorkload,
            actualPlannedWorkLoad: actual,
        } as ContributedValueDto);
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
                    valueStreamByWeek.id.toValue() ===
                    valueStreamDto.id.toValue(),
            );
            const actualPlanAndWorkLog = actualPlanAndWorkLogDtos.find(
                (actualPlan) =>
                    actualPlan.contributedValueId ===
                    committedWLDto.contributedValue.id.toValue(),
            );
            if (!valueStreamByWeekDto) {
                let contributedValueDtos = new Array<ContributedValueDto>();
                contributedValueDtos = this.combineContributedValueDto(
                    contributedValueDtos,
                    expertiseDto,
                    committedWLDto,
                    plannedWLDtos,
                    actualPlanAndWorkLog,
                );
                valueStreamByWeekDtos.push({
                    id: valueStreamDto.id,
                    name: valueStreamDto.name,
                    contributedValues: contributedValueDtos,
                } as ValueStreamByWeekDto);
            } else {
                let contributedValueDtos =
                    valueStreamByWeekDto.contributedValues;
                if (!valueStreamByWeekDto.contributedValues) {
                    contributedValueDtos = new Array<ContributedValueDto>();
                }
                contributedValueDtos = this.combineContributedValueDto(
                    contributedValueDtos,
                    expertiseDto,
                    committedWLDto,
                    plannedWLDtos,
                    actualPlanAndWorkLog,
                );
                valueStreamByWeekDto.contributedValues = contributedValueDtos;
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

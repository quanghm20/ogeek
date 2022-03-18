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
        actualPlanAndWorkLogDtos: ActualPlanAndWorkLogDto,
    ): ContributedValueDto[] {
        const plannedWorkload = plannedWLDtos.find(
            (planned) => planned.committedWorkload.id === committedWLDto.id,
        );
        const results = contributedValueDtos;
        contributedValueDtos.push({
            expertiseScopeId: Number(expertiseDto.id.toString()),
            expertiseScopeName: expertiseDto.name,
            committedWorkLoad: committedWLDto.committedWorkload,
            plannedWorkLoad: plannedWorkload
                ? plannedWorkload.plannedWorkload
                : committedWLDto.committedWorkload,
            actualPlannedWorkLoad: actualPlanAndWorkLogDtos.actualPlan,
            workLog: actualPlanAndWorkLogDtos.workLog,
        } as ContributedValueDto);
        return results;
    }

    public static combineAllDto(
        committedWLDtos: CommittedWorkloadDto[],
        plannedWLDtos: PlannedWorkloadDto[],
        actualPlanAndWorkLogDtos: ActualPlanAndWorkLogDto,
        valueStreamDtos: ValueStreamDto[],
        userDto: UserDto,
        week: number,
        startDateOfWeek: Date,
        endDateOfWeek: Date,
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
            if (!valueStreamByWeekDto) {
                let contributedValueDtos = new Array<ContributedValueDto>();
                contributedValueDtos = this.combineContributedValueDto(
                    contributedValueDtos,
                    expertiseDto,
                    committedWLDto,
                    plannedWLDtos,
                    actualPlanAndWorkLogDtos,
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
                    actualPlanAndWorkLogDtos,
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
            startDateOfWeek,
            endDateOfWeek,
            status,
            valueStreamsByWeek: valueStreamByWeekDtos,
        } as ValueStreamsByWeekDto;
    }
}

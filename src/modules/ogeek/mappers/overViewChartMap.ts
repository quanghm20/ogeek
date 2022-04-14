import { MAX_VIEWCHART_LENGTH } from '../../../common/constants/chart';
import { ASSIGN_NUMBER } from '../../../common/constants/number';
import { CommittedWorkload } from '../domain/committedWorkload';
import { ExpertiseScope } from '../domain/expertiseScope';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { OverviewChartDataDto } from '../infra/dtos/overviewChart/overviewChartData.dto';
import { WorkloadOverviewDto } from '../infra/dtos/overviewChart/workloadOverview.dto';

export class OverViewChartMap {
    public static combineAllToDto(
        expertiseScopes: ExpertiseScope[],
        committedWorkloads: CommittedWorkload[],
        plannedWorkloads: PlannedWorkload[],
        weekChartArray: number[],
    ): OverviewChartDataDto[] {
        const overviewChartDataDtos = new Array<OverviewChartDataDto>();
        expertiseScopes.forEach((expertiseScope) => {
            const expertiseScopeId = expertiseScope.id.toValue();
            let myPlannedLength = 0;
            const myCommittedWorkload = committedWorkloads.find(
                (committedWorkload) =>
                    committedWorkload.belongToExpertiseScope(expertiseScopeId),
            );
            if (myCommittedWorkload) {
                const contributedValue = Array<WorkloadOverviewDto>();
                weekChartArray.forEach((weekItem) => {
                    const plannedBetWeenWeek = plannedWorkloads.find(
                        (plannedWl) =>
                            plannedWl.isBetweenWeek(weekItem) &&
                            plannedWl.isBelongToCommit(
                                myCommittedWorkload.id.toValue(),
                            ),
                    );
                    if (plannedBetWeenWeek) {
                        contributedValue.push({
                            week: weekItem,
                            plannedWorkload: plannedBetWeenWeek.plannedWorkload,
                            actualWorkload: ASSIGN_NUMBER,
                        } as WorkloadOverviewDto);

                        myPlannedLength++;
                    } else {
                        contributedValue.push({
                            week: weekItem,
                            plannedWorkload:
                                myCommittedWorkload.committedWorkload,
                            actualWorkload: ASSIGN_NUMBER,
                        } as WorkloadOverviewDto);
                    }
                });
                overviewChartDataDtos.push({
                    expertiseScopeId,
                    expertiseScopes: contributedValue,
                    expertiseScope: expertiseScope.name,
                    worklogLength: MAX_VIEWCHART_LENGTH - myPlannedLength,
                    actualPlannedWorkloadLength: myPlannedLength,
                } as OverviewChartDataDto);
            }
        });
        return overviewChartDataDtos;
    }
}

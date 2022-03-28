import * as moment from 'moment';

import { IssueType } from '../../../common/constants/issue-type';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';
import { IssueDto } from '../infra/dtos/issue.dto';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
import { UserDto } from '../infra/dtos/user.dto';
import { ActualWorkloadListDto } from '../infra/dtos/workloadListByWeek/actualWorkloadList.dto';
import { CommittedWorkloadByWeekDto } from '../infra/dtos/workloadListByWeek/committedWorkloadOfWeek.dto';
import { ExpertiseScopeWithinWorkloadListDto } from '../infra/dtos/workloadListByWeek/expertiseScopeWithinWorkloadList.dto';
import { WorkloadListByWeekDto } from '../infra/dtos/workloadListByWeek/workloadListByWeek.dto';

interface ResultExpertiseScopeAndTotalWL {
    expertiseScopeArray: ExpertiseScopeWithinWorkloadListDto[];
    totalPlannedWL: number;
    totalCommittedWL: number;
}

export class WorkloadListByWeekMap {
    public static handleActualWorkload(
        actualWorkloadByUser: ActualWorkloadListDto,
    ): number {
        if (actualWorkloadByUser) {
            return actualWorkloadByUser.actualWorkload;
        }

        return 0;
    }

    public static handleIssue(issues: IssueDto[], user: UserDto): IssueType {
        const issueItem = issues.find(
            (issue) =>
                Number(issue.user.id.toString()) === Number(user.id.toString()),
        );

        if (issueItem) {
            return issueItem.type;
        }

        return IssueType.NOT_ISSUE;
    }
    public static handlePlannedWL(
        arrPlannedWLByUser: PlannedWorkloadDto[],
        committedItem: CommittedWorkloadDto,
    ): number {
        const plannedWorkloadItem = arrPlannedWLByUser.find(
            (plan) =>
                Number(plan.committedWorkload.id.toString()) ===
                Number(committedItem.id.toString()),
        );

        if (plannedWorkloadItem) {
            return plannedWorkloadItem.plannedWorkload;
        }

        return 0;
    }

    public static handleActualWL(
        actualWorkloadByUser: ActualWorkloadListDto,
        committedItem: CommittedWorkloadDto,
    ): number {
        if (actualWorkloadByUser) {
            const findExpertiseScope =
                actualWorkloadByUser.expertiseScopes.find(
                    (exp) =>
                        exp.id ===
                        Number(
                            committedItem.contributedValue.valueStream.id.toString(),
                        ),
                );

            if (findExpertiseScope) {
                return findExpertiseScope.worklog;
            }
        }

        return 0;
    }

    public static handleExpertiseAndTotalWL(
        plannedWLDtos: PlannedWorkloadDto[],
        committedWLByUserArray: CommittedWorkloadDto[],
        user: UserDto,
        actualWorkloadByUser: ActualWorkloadListDto,
    ): ResultExpertiseScopeAndTotalWL {
        const plannedWLByUserArray = plannedWLDtos.filter(
            (plan) =>
                Number(plan.user.id.toString()) === Number(user.id.toString()),
        );
        const totalCommittedWL = committedWLByUserArray.reduce(
            (total, item) => total + item.committedWorkload,
            0,
        );
        let totalPlannedWL = totalCommittedWL;

        let expertiseScopeArray =
            new Array<ExpertiseScopeWithinWorkloadListDto>();
        if (plannedWLByUserArray.length === 0) {
            expertiseScopeArray = committedWLByUserArray.map(
                (com) =>
                    ({
                        expertiseScope: {
                            name: com.contributedValue.expertiseScope.name,
                            id: Number(
                                com.contributedValue.expertiseScope.id.toString(),
                            ),
                        },
                        committedWorkload: com.committedWorkload,
                        plannedWorkload: com.committedWorkload,
                        worklog: this.handleActualWL(actualWorkloadByUser, com),
                    } as ExpertiseScopeWithinWorkloadListDto),
            );
        } else {
            expertiseScopeArray = committedWLByUserArray.map(
                (com) =>
                    ({
                        expertiseScope: {
                            name: com.contributedValue.expertiseScope.name,
                            id: Number(
                                com.contributedValue.expertiseScope.id.toString(),
                            ),
                        },
                        committedWorkload: com.committedWorkload,
                        plannedWorkload:
                            this.handlePlannedWL(plannedWLByUserArray, com) ===
                            0
                                ? com.committedWorkload
                                : this.handlePlannedWL(
                                      plannedWLByUserArray,
                                      com,
                                  ),
                        worklog: this.handleActualWL(actualWorkloadByUser, com),
                    } as ExpertiseScopeWithinWorkloadListDto),
            );

            totalPlannedWL = plannedWLByUserArray.reduce(
                (total, item) => total + item.plannedWorkload,
                0,
            );
        }

        return { expertiseScopeArray, totalPlannedWL, totalCommittedWL };
    }

    public static combineAllDto(
        committedWLDtos: CommittedWorkloadDto[],
        plannedWLDtos: PlannedWorkloadDto[],
        userDtos: UserDto[],
        actualWorkloads: ActualWorkloadListDto[],
        issues: IssueDto[],
        endDateOfWeek: string,
    ): WorkloadListByWeekDto[] {
        const workloadListByWeek = new Array<WorkloadListByWeekDto>();
        userDtos.forEach((user) => {
            const actualWorkloadByUser = actualWorkloads.find(
                (actual) =>
                    Number(actual.user.id.toString()) ===
                    Number(user.id.toString()),
            );

            const committedWLByUserArray = committedWLDtos.filter(
                (com) =>
                    Number(com.user.id.toString()) ===
                    Number(user.id.toString()),
            );

            const oneItemOfCommittedWL = committedWLByUserArray[0];

            if (committedWLByUserArray.length === 0) {
                return workloadListByWeek.push({
                    user: {
                        alias: user.alias,
                        id: Number(user.id.toString()),
                        avatar: user.avatar,
                    },
                    expertiseScopes: [],
                    committedWorkload: {
                        startDate: '',
                        expiredDate: '',
                        workload: 0,
                    },
                    plannedWorkload: 0,
                    actualWorkload: 0,
                    issueType: IssueType.NOT_ISSUE,
                });
            }
            if (oneItemOfCommittedWL.expiredDate < new Date()) {
                return workloadListByWeek.push({
                    user: {
                        alias: user.alias,
                        id: Number(user.id.toString()),
                        avatar: user.avatar,
                    },
                    expertiseScopes: [],
                    committedWorkload: {
                        startDate: moment(
                            committedWLByUserArray[0].startDate,
                        ).format('DD-MM-YYYY'),
                        expiredDate: moment(
                            committedWLByUserArray[0].expiredDate,
                        ).format('DD-MM-YYYY'),
                        workload: 0,
                    },
                    plannedWorkload: 0,
                    actualWorkload: 0,
                    issueType: IssueType.NOT_ISSUE,
                });
            }
            if (
                moment(oneItemOfCommittedWL.startDate).format() > endDateOfWeek
            ) {
                return true;
            }

            let resultExpAndTotalWL = {} as ResultExpertiseScopeAndTotalWL;
            resultExpAndTotalWL = this.handleExpertiseAndTotalWL(
                plannedWLDtos,
                committedWLByUserArray,
                user,
                actualWorkloadByUser,
            );

            const committedWLByUser = {
                startDate: moment(oneItemOfCommittedWL.startDate).format(
                    'DD-MM-YYYY',
                ),
                expiredDate: moment(oneItemOfCommittedWL.expiredDate).format(
                    'DD-MM-YYYY',
                ),
                workload: resultExpAndTotalWL.totalCommittedWL,
            } as CommittedWorkloadByWeekDto;

            workloadListByWeek.push({
                user: {
                    alias: user.alias,
                    id: Number(user.id.toString()),
                    avatar: user.avatar,
                },
                expertiseScopes: resultExpAndTotalWL.expertiseScopeArray,
                committedWorkload: committedWLByUser,
                plannedWorkload: resultExpAndTotalWL.totalPlannedWL,
                actualWorkload: this.handleActualWorkload(actualWorkloadByUser),
                issueType: this.handleIssue(issues, user),
            });
        });

        return workloadListByWeek;
    }
}

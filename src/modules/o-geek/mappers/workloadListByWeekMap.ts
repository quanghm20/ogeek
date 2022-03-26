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
    arrExpertiseScope: ExpertiseScopeWithinWorkloadListDto[];
    totalPlannedWL: number;
    totalCommittedWL: number;
}

export class WorkloadListByWeekMap {
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
        arrCommittedWLByUser: CommittedWorkloadDto[],
        user: UserDto,
        actualWorkloadByUser: ActualWorkloadListDto,
    ): ResultExpertiseScopeAndTotalWL {
        const plannedWLByUserArray = plannedWLDtos.filter((plan) => {
            if (
                Number(plan.user.id.toString()) === Number(user.id.toString())
            ) {
                return plan;
            }
        });
        const totalCommittedWL = arrCommittedWLByUser.reduce(
            (total, item) => total + item.committedWorkload,
            0,
        );
        let totalPlannedWL = totalCommittedWL;

        let arrExpertiseScope =
            new Array<ExpertiseScopeWithinWorkloadListDto>();
        if (plannedWLByUserArray.length === 0) {
            arrExpertiseScope = arrCommittedWLByUser.map(
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
            arrExpertiseScope = arrCommittedWLByUser.map(
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

        return { arrExpertiseScope, totalPlannedWL, totalCommittedWL };
    }

    public static combineAllDto(
        committedWLDtos: CommittedWorkloadDto[],
        plannedWLDtos: PlannedWorkloadDto[],
        userDtos: UserDto[],
        actualWorkloads: ActualWorkloadListDto[],
        issues: IssueDto[],
    ): WorkloadListByWeekDto[] {
        const workloadListByWeek = new Array<WorkloadListByWeekDto>();
        userDtos.forEach((user) => {
            const actualWorkloadByUser = actualWorkloads.find(
                (actual) =>
                    Number(actual.user.id.toString()) ===
                    Number(user.id.toString()),
            );

            const arrCommittedWLByUser = committedWLDtos.filter((com) => {
                if (
                    Number(com.user.id.toString()) ===
                    Number(user.id.toString())
                ) {
                    return com;
                }
            });

            if (arrCommittedWLByUser.length === 0) {
                workloadListByWeek.push({
                    user: {
                        alias: user.alias,
                        id: user.id,
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
            } else if (arrCommittedWLByUser[0].expiredDate < new Date()) {
                workloadListByWeek.push({
                    user: {
                        alias: user.alias,
                        id: user.id,
                        avatar: user.avatar,
                    },
                    expertiseScopes: [],
                    committedWorkload: {
                        startDate: moment(
                            arrCommittedWLByUser[0].startDate,
                        ).format('DD-MM-YYYY'),
                        expiredDate: moment(
                            arrCommittedWLByUser[0].expiredDate,
                        ).format('DD-MM-YYYY'),
                        workload: 0,
                    },
                    plannedWorkload: 0,
                    actualWorkload: 0,
                    issueType: IssueType.NOT_ISSUE,
                });
            } else {
                let resultExpAndTotalWL = {} as ResultExpertiseScopeAndTotalWL;
                resultExpAndTotalWL = this.handleExpertiseAndTotalWL(
                    plannedWLDtos,
                    arrCommittedWLByUser,
                    user,
                    actualWorkloadByUser,
                );

                const oneItemOfCommittedWL = arrCommittedWLByUser[0];

                const committedWLByUser = {
                    startDate: moment(oneItemOfCommittedWL.startDate).format(
                        'DD-MM-YYYY',
                    ),
                    expiredDate: moment(
                        oneItemOfCommittedWL.expiredDate,
                    ).format('DD-MM-YYYY'),
                    workload: resultExpAndTotalWL.totalCommittedWL,
                } as CommittedWorkloadByWeekDto;

                workloadListByWeek.push({
                    user: {
                        alias: user.alias,
                        id: Number(user.id.toString()),
                        avatar: user.avatar,
                    },
                    expertiseScopes: resultExpAndTotalWL.arrExpertiseScope,
                    committedWorkload: committedWLByUser,
                    plannedWorkload: resultExpAndTotalWL.totalPlannedWL,
                    actualWorkload: actualWorkloadByUser.actualWorkload,
                    issueType: this.handleIssue(issues, user),
                });
            }
        });

        return workloadListByWeek;
    }
}

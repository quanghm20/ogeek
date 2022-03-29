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

interface IHashCommittedWorkload {
    [key: string]: CommittedWorkloadDto;
}

interface IHashPlannedWorkload {
    [key: string]: PlannedWorkloadDto;
}

export class WorkloadListByWeekMap {
    public static handleDuplicateExpOfCommittedArray(
        committedWLByUserArray: CommittedWorkloadDto[],
    ): CommittedWorkloadDto[] {
        const hashMap: IHashCommittedWorkload = {};

        committedWLByUserArray.forEach((workload) => {
            if (
                !hashMap[workload.contributedValue.expertiseScope.id.toString()]
            ) {
                hashMap[
                    workload.contributedValue.expertiseScope.id.toString()
                ] = workload;
                return true;
            }

            hashMap[
                workload.contributedValue.expertiseScope.id.toString()
            ].committedWorkload += workload.committedWorkload;
        });

        return Object.values(hashMap);
    }

    public static handleDuplicateExpOfPlannedArray(
        plannedWLByUserArray: PlannedWorkloadDto[],
    ): PlannedWorkloadDto[] {
        const hashMap: IHashPlannedWorkload = {};

        plannedWLByUserArray.forEach((workload) => {
            if (
                !hashMap[workload.contributedValue.expertiseScope.id.toString()]
            ) {
                hashMap[
                    workload.contributedValue.expertiseScope.id.toString()
                ] = { ...workload };
            } else {
                hashMap[
                    workload.contributedValue.expertiseScope.id.toString()
                ].plannedWorkload += workload.plannedWorkload;
            }
        });

        return Object.values(hashMap);
    }

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
        const handlePlan =
            this.handleDuplicateExpOfPlannedArray(arrPlannedWLByUser);
        const plannedWorkloadItem = handlePlan.find(
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
                            committedItem.contributedValue.expertiseScope.id.toString(),
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
        const handleCommittedWL = this.handleDuplicateExpOfCommittedArray(
            committedWLByUserArray,
        );
        if (plannedWLByUserArray.length === 0) {
            expertiseScopeArray = handleCommittedWL.map(
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
            expertiseScopeArray = handleCommittedWL.map((com) => {
                const handlePlanWorkload = this.handlePlannedWL(
                    plannedWLByUserArray,
                    com,
                );
                return {
                    expertiseScope: {
                        name: com.contributedValue.expertiseScope.name,
                        id: Number(
                            com.contributedValue.expertiseScope.id.toString(),
                        ),
                    },
                    committedWorkload: com.committedWorkload,
                    plannedWorkload:
                        handlePlanWorkload === 0
                            ? com.committedWorkload
                            : handlePlanWorkload,
                    worklog: this.handleActualWL(actualWorkloadByUser, com),
                } as ExpertiseScopeWithinWorkloadListDto;
            });
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
                        createdAt: '',
                    },
                    plannedWorkload: 0,
                    actualWorkload: 0,
                    weekStatus: user.weekStatus,
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
                            oneItemOfCommittedWL.startDate,
                        ).format('YYYY-MM-DD'),
                        expiredDate: moment(
                            oneItemOfCommittedWL.expiredDate,
                        ).format('YYYY-MM-DD'),
                        createdAt: moment(
                            oneItemOfCommittedWL.createdAt,
                        ).format(),
                        workload: 0,
                    },
                    plannedWorkload: 0,
                    actualWorkload: 0,
                    weekStatus: user.weekStatus,
                    issueType: IssueType.NOT_ISSUE,
                });
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
                    'YYYY-MM-DD',
                ),
                expiredDate: moment(oneItemOfCommittedWL.expiredDate).format(
                    'YYYY-MM-DD',
                ),
                createdAt: moment(oneItemOfCommittedWL.createdAt).format(),
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
                weekStatus: user.weekStatus,
                issueType: this.handleIssue(issues, user),
            });
        });

        return workloadListByWeek;
    }
}

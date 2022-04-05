import * as moment from 'moment';

import { CommittedWorkloadStatus } from '../../../common/constants/committedStatus';
import { IssueType } from '../../../common/constants/issueType';
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
    public static handleOverlapCommittedWorkload(
        committedWLByUserArray: CommittedWorkloadDto[],
    ): CommittedWorkloadDto[] {
        const myMap = new Map<string, CommittedWorkloadDto[]>();
        const array1 = new Array<CommittedWorkloadDto>();
        const array2 = new Array<CommittedWorkloadDto>();
        committedWLByUserArray.forEach((commit) => {
            if (myMap.has(commit.status)) {
                array1.push(commit);
                myMap.set(commit.status, array1);
                return;
            }
            array2.push(commit);
            myMap.set(commit.status, array2);
        });

        if (myMap.size === 2) {
            return myMap.get(CommittedWorkloadStatus.ACTIVE);
        }

        return committedWLByUserArray;
    }

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

        return null;
    }

    public static handlePlannedWL(
        handlePlannedWLArray: PlannedWorkloadDto[],
        committedItem: CommittedWorkloadDto,
    ): number {
        const plannedWorkloadItem = handlePlannedWLArray.find(
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
        const handleCommittedWLArray = this.handleDuplicateExpOfCommittedArray(
            committedWLByUserArray,
        );
        if (plannedWLByUserArray.length === 0) {
            expertiseScopeArray = handleCommittedWLArray.map(
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
            const handlePlannedWLArray =
                this.handleDuplicateExpOfPlannedArray(plannedWLByUserArray);
            expertiseScopeArray = handleCommittedWLArray.map((com) => {
                const handlePlanWorkload = this.handlePlannedWL(
                    handlePlannedWLArray,
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

            const handleOverlapCommittedWL =
                this.handleOverlapCommittedWorkload(committedWLByUserArray);

            const firstCommittedWLItem = handleOverlapCommittedWL[0];

            if (committedWLByUserArray.length === 0) {
                return;
            }

            let resultExpAndTotalWL = {} as ResultExpertiseScopeAndTotalWL;
            resultExpAndTotalWL = this.handleExpertiseAndTotalWL(
                plannedWLDtos,
                handleOverlapCommittedWL,
                user,
                actualWorkloadByUser,
            );

            const committedWLByUser = {
                startDate: moment(firstCommittedWLItem.startDate).format(
                    'YYYY-MM-DD',
                ),
                expiredDate: moment(firstCommittedWLItem.expiredDate).format(
                    'YYYY-MM-DD',
                ),
                updatedAt: moment(firstCommittedWLItem.updatedAt).format(
                    'DD-MM-YYYY hh:mm:ss',
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
                weekStatus: user.weekStatus,
                issueType: this.handleIssue(issues, user),
            });
        });

        return workloadListByWeek;
    }
}

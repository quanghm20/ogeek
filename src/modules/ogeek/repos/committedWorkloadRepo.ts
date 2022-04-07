import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import {
    Between,
    getConnection,
    LessThan,
    LessThanOrEqual,
    MoreThan,
    MoreThanOrEqual,
    Repository,
} from 'typeorm';

import { CommittedWorkloadStatus } from '../../../common/constants/committedStatus';
import { dateRange } from '../../../common/constants/dateRange';
import { Order } from '../../../common/constants/order';
import { PlannedWorkloadStatus } from '../../../common/constants/plannedStatus';
import { MomentService } from '../../../providers/moment.service';
import { CommittedWorkload } from '../domain/committedWorkload';
import { DomainId } from '../domain/domainId';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { UserEntity } from '../infra/database/entities/user.entity';
import { WorkloadDto } from '../infra/dtos/workload.dto';
import { StartEndDateOfWeekWLInputDto } from '../infra/dtos/workloadListByWeek/startEndDateOfWeekInput.dto';
import { CommittedWorkloadMap } from '../mappers/committedWorkloadMap';
import { PlannedWorkloadMap } from '../mappers/plannedWorkloadMap';
import { FilterCommittedWorkload } from '../useCases/committedWorkload/CommittedWorkloadController';

export interface ICommittedWorkloadRepo {
    findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<CommittedWorkload[]>;
    findById(
        committedWorkloadId: DomainId | number,
    ): Promise<CommittedWorkload>;
    save(
        committedWorkload: CommittedWorkloadEntity,
    ): Promise<CommittedWorkload>;
    saveCommits(
        committedWorkload: WorkloadDto[],
        userId: number,
        startDate: Date,
        expiredDate: Date,
        createdBy: number,
    ): Promise<CommittedWorkload[]>;
    findByUserIdInTimeRange(
        userId: DomainId | number,
        startDateInWeek: Date,
    ): Promise<CommittedWorkload[]>;
    findByIdInPrecedingWeeks(
        userId: DomainId | number,
        startDate: Date,
    ): Promise<CommittedWorkload[]>;
    findByUserId(userId: DomainId | number): Promise<CommittedWorkload[]>;
    findByUserIdOverview(
        userId: DomainId | number,
    ): Promise<CommittedWorkload[]>;
    findAllActiveCommittedWorkload(
        query?: FilterCommittedWorkload,
    ): Promise<CommittedWorkload[]>;
    findAllExpertiseScope(userId: number, startDate: string): Promise<number[]>;
    findByValueStreamAndExpertiseScope(
        valueStreamId: number,
        expertiseScopeId: number,
        userId: number,
    ): Promise<CommittedWorkloadEntity[]>;
    findAllActiveCommittedWorkloadByUser(
        userId?: number,
    ): Promise<CommittedWorkload[]>;
    updateCommittedWorkloadExpired(): Promise<void>;
    findByUserIdValueStream(
        userId: DomainId | number,
        startDateOfWeek: Date,
        endDateOfWeek: Date,
    ): Promise<CommittedWorkload[]>;
}

@Injectable()
export class CommittedWorkloadRepository implements ICommittedWorkloadRepo {
    constructor(
        @InjectRepository(CommittedWorkloadEntity)
        protected repo: Repository<CommittedWorkloadEntity>,
        @InjectRepository(ContributedValueEntity)
        protected repoContributed: Repository<ContributedValueEntity>,
    ) {}
    async findByUserId(
        userId: DomainId | number,
    ): Promise<CommittedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entities = await this.repo.find({
            where: {
                status: CommittedWorkloadStatus.ACTIVE,
                user: userId,
                expiredDate: MoreThanOrEqual(new Date()),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'user',
            ],
        });

        return entities
            ? CommittedWorkloadMap.toDomainAll(entities)
            : new Array<CommittedWorkload>();
    }

    async findByValueStreamAndExpertiseScope(
        valueStreamId: number,
        expertiseScopeId: number,
        userId: number,
    ): Promise<CommittedWorkloadEntity[]> {
        const entities = await this.repo.find({
            where: {
                contributedValue: {
                    valueStream: {
                        id: valueStreamId,
                    },
                    expertiseScope: {
                        id: expertiseScopeId,
                    },
                },
                user: {
                    id: userId,
                },
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'user',
            ],
        });
        return entities ? entities : null;
    }

    async findByUserIdOverview(
        userId: DomainId | number,
    ): Promise<CommittedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.find({
            where: {
                user: {
                    id: userId,
                },
                status: CommittedWorkloadStatus.ACTIVE,
            },
            relations: [
                'contributedValue',
                'contributedValue.valueStream',
                'contributedValue.expertiseScope',
                'user',
            ],
        });
        return entity ? CommittedWorkloadMap.toArrayDomain(entity) : null;
    }

    async findById(
        committedWorkloadId: DomainId | number,
    ): Promise<CommittedWorkload> {
        committedWorkloadId =
            committedWorkloadId instanceof DomainId
                ? Number(committedWorkloadId.id.toValue())
                : committedWorkloadId;
        const entity = await this.repo.findOne({
            where: {
                id: committedWorkloadId,
            },
            relations: [
                'contributedValue',
                'contributedValue.valueStream',
                'contributedValue.expertiseScope',
                'user',
            ],
        });

        return entity ? CommittedWorkloadMap.toDomain(entity) : null;
    }
    async save(
        committedWorkload: CommittedWorkloadEntity,
    ): Promise<CommittedWorkload> {
        const entity = await this.repo.save(committedWorkload);
        return entity ? CommittedWorkloadMap.toDomain(entity) : null;
    }
    async saveCommits(
        committedWorkload: WorkloadDto[],
        userId: number,
        startDate: Date,
        expiredDate: Date,
        createdBy: number,
    ): Promise<CommittedWorkload[]> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        try {
            const user = new UserEntity(userId);
            const now = new Date();
            now.setHours(0, 0, 0);
            startDate = moment(startDate).add(dateRange.UTC, 'hours').toDate();
            expiredDate = moment(expiredDate)
                .add(dateRange.UTC, 'hours')
                .toDate();
            const result = Array<number>();
            let status = CommittedWorkloadStatus.INACTIVE;
            let oldStatus = CommittedWorkloadStatus.ACTIVE;

            await queryRunner.startTransaction();

            if (now >= startDate) {
                status = CommittedWorkloadStatus.ACTIVE;
                oldStatus = CommittedWorkloadStatus.INACTIVE;
            }
            if (now <= startDate) {
                await this.repo.update(
                    {
                        user,
                        status: CommittedWorkloadStatus.ACTIVE,
                    },
                    {
                        status: oldStatus,
                        expiredDate: startDate,
                        updatedAt: now,
                    },
                );
            }
            for await (const workload of committedWorkload) {
                const contribute = await this.repoContributed.findOne({
                    where: {
                        valueStream: {
                            id: workload.valueStreamId,
                        },
                        expertiseScope: {
                            id: workload.expertiseScopeId,
                        },
                    },
                });
                const committed = new CommittedWorkloadEntity(
                    0,
                    user,
                    contribute,
                    workload.workload,
                    startDate,
                    expiredDate,
                    status,
                    createdBy,
                    createdBy,
                );

                const save = await queryRunner.manager.save(committed);
                const plan =
                    await this.autoGeneratePlannedWorkloadByCommittedWorkload(
                        save,
                    );
                if (plan.length === 0) {
                    await queryRunner.rollbackTransaction();
                }
                result.push(save.id);
            }
            await queryRunner.commitTransaction();
            const commits = await this.repo.findByIds(result, {
                relations: [
                    'contributedValue',
                    'contributedValue.valueStream',
                    'contributedValue.expertiseScope',
                    'user',
                ],
            });
            return commits ? CommittedWorkloadMap.toArrayDomain(commits) : null;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return null;
        } finally {
            await queryRunner.release();
        }
    }
    async findByUserIdInTimeRange(
        userId: DomainId | number,
        startDateInWeek: Date,
    ): Promise<CommittedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entities = await this.repo.find({
            where: {
                user: { id: userId },
                startDate:
                    MoreThanOrEqual(
                        MomentService.shiftFirstDateChart(startDateInWeek),
                    ) &&
                    LessThanOrEqual(
                        MomentService.shiftLastDateChart(startDateInWeek),
                    ),
            },
            relations: [
                'contributedValue',
                'user',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
            ],
        });
        return entities
            ? CommittedWorkloadMap.toDomainAll(entities)
            : new Array<CommittedWorkload>();
    }

    async findByIdInPrecedingWeeks(
        userId: DomainId | number,
        startDate: Date,
    ): Promise<CommittedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                user: userId,
                startDate: MoreThanOrEqual(
                    MomentService.shiftFirstDateChart(startDate),
                ),
                expiredDate: LessThan(
                    MomentService.getFirstDateOfWeek(startDate),
                ),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
            ],
        });
        return entities ? CommittedWorkloadMap.toDomainAll(entities) : null;
    }

    async findAllActiveCommittedWorkload(
        query?: FilterCommittedWorkload,
    ): Promise<CommittedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                user: {
                    id: query.userId,
                },
                status: CommittedWorkloadStatus.ACTIVE,
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'user',
            ],
        });
        return entities ? CommittedWorkloadMap.toDomainAll(entities) : null;
    }
    async findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<CommittedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                startDate: LessThanOrEqual(startDateOfWeek),
                expiredDate: MoreThanOrEqual(endDateOfWeek),
            },
            relations: [
                'user',
                'contributedValue',
                'contributedValue.valueStream',
                'contributedValue.expertiseScope',
            ],
        });

        return entities ? CommittedWorkloadMap.toArrayDomain(entities) : null;
    }
    async findAllExpertiseScope(
        userId: number,
        startDate: string,
    ): Promise<number[]> {
        const now = moment(new Date()).format('YYYY-MM-DD');
        const entities = await this.repo.find({
            where: {
                user: { id: userId },
                startDate: Between(startDate, now),
            },
            relations: [
                'user',
                'contributedValue',
                'contributedValue.expertiseScope',
            ],
        });
        if (entities.length <= 0) {
            return null;
        }
        const arr = new Array<number>();
        for (const entity of entities) {
            if (arr.includes(entity.contributedValue.expertiseScope.id)) {
                continue;
            }
            arr.push(entity.contributedValue.expertiseScope.id);
        }
        return arr;
    }
    async findAllActiveCommittedWorkloadByUser(
        userId?: number,
    ): Promise<CommittedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                user: {
                    id: userId,
                },
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'user',
            ],
            order: {
                expiredDate: Order.DESC,
            },
        });
        return entities ? CommittedWorkloadMap.toDomainAll(entities) : null;
    }
    async updateCommittedWorkloadExpired(): Promise<void> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        const now = moment(new Date()).format('YYYY-MM-DD');
        await queryRunner.startTransaction();

        try {
            await this.repo.update(
                {
                    expiredDate: now,
                    status: CommittedWorkloadStatus.ACTIVE,
                },
                {
                    status: CommittedWorkloadStatus.INACTIVE,
                    updatedAt: new Date(),
                },
            );
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
    async findByUserIdValueStream(
        userId: DomainId | number,
        startDateOfWeek: Date,
        endDateOfWeek: Date,
    ): Promise<CommittedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entities = await this.repo.find({
            where: {
                status: CommittedWorkloadStatus.ACTIVE,
                user: userId,
                startDate: LessThan(endDateOfWeek),
                endDate: MoreThan(startDateOfWeek),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'user',
            ],
        });
        return entities
            ? CommittedWorkloadMap.toDomainAll(entities)
            : new Array<CommittedWorkload>();
    }

    async autoGeneratePlannedWorkloadByCommittedWorkload(
        committedWorkload: CommittedWorkloadEntity,
    ): Promise<PlannedWorkload[]> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let startDate = moment(committedWorkload.startDate);
            const expiredDate = moment(committedWorkload.expiredDate);
            const workload = committedWorkload.committedWorkload;
            const result = new Array<PlannedWorkload>();
            if (startDate.weekday() < 6) {
                startDate = startDate.add(startDate.weekday(), 'd');
            }
            for (let i = startDate.weeks(); i <= expiredDate.weeks(); i++) {
                const plannedWorkload = new PlannedWorkloadEntity();
                plannedWorkload.committedWorkload = committedWorkload;
                plannedWorkload.contributedValue =
                    committedWorkload.contributedValue;
                plannedWorkload.createdAt = new Date();
                plannedWorkload.plannedWorkload = workload;
                plannedWorkload.reason = `Auto generate planned workload by committed workload for ${committedWorkload.id} week ${i} `;
                plannedWorkload.startDate = startDate.toDate();
                plannedWorkload.status = PlannedWorkloadStatus.PLANNING;
                plannedWorkload.user = committedWorkload.user;
                plannedWorkload.updatedAt = new Date();
                const res = await queryRunner.manager.save(
                    PlannedWorkloadEntity,
                    plannedWorkload,
                );
                result.push(PlannedWorkloadMap.toDomain(res));
                startDate = startDate.add(7, 'd');
            }
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
            return null;
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
    }
}

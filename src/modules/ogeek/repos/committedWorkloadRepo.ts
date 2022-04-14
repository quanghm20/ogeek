import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import {
    Between,
    getConnection,
    LessThan,
    LessThanOrEqual,
    MoreThan,
    MoreThanOrEqual,
    Not,
    Repository,
} from 'typeorm';

import { CommittedWorkloadStatus } from '../../../common/constants/committedStatus';
import { Order } from '../../../common/constants/order';
import { PlannedWorkloadStatus } from '../../../common/constants/plannedStatus';
import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { MomentService } from '../../../providers/moment.service';
import { CommittedWorkload } from '../domain/committedWorkload';
import { DomainId } from '../domain/domainId';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import {
    DataHistoryCommittedWorkload,
    FilterHistoryCommittedWorkload,
} from '../infra/dtos/historyCommittedWorkload/HistoryCommittedWorkload.dto';
import { StartEndDateOfWeekWLInputDto } from '../infra/dtos/workloadListByWeek/startEndDateOfWeekInput.dto';
import { CommittedWorkloadMap } from '../mappers/committedWorkloadMap';
import { PlannedWorkloadMap } from '../mappers/plannedWorkloadMap';
import { FilterCommittedWorkload } from '../useCases/committedWorkload/FilterCommittedWorkload';
import { IPlannedWorkloadRepo } from './plannedWorkloadRepo';

export class PaginationCommittedWorkload {
    meta?: PageMetaDto;

    data?: CommittedWorkload[];
    constructor(meta: PageMetaDto, data: CommittedWorkload[]) {
        this.meta = meta;

        this.data = data;
    }
}

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
    addCommittedWorkload(
        committedWorkload: CommittedWorkloadEntity[],
        oldCommittedWorkLoad?: CommittedWorkloadEntity[],
    ): Promise<CommittedWorkload[]>;
    findByUserIdInTimeRange(
        userId: DomainId | number,
        startDateChart: Date,
        endDateChart: Date,
    ): Promise<CommittedWorkload[]>;
    findByIdInPrecedingWeeks(
        userId: DomainId | number,
        startDate: Date,
    ): Promise<CommittedWorkload[]>;
    findByUserId(
        userId: DomainId | number,
        status: CommittedWorkloadStatus,
    ): Promise<CommittedWorkload[]>;
    findByUserIdOverview(
        userId: DomainId | number,
    ): Promise<CommittedWorkload[]>;
    findAllCommittedWorkload(
        query?: FilterCommittedWorkload,
    ): Promise<PaginationCommittedWorkload>;
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
    findCommittedInComing(userId: number): Promise<CommittedWorkload>;
    findAllCommittedInComing(userId: number): Promise<CommittedWorkload[]>;
    findHistoryCommittedWorkload(
        query?: FilterHistoryCommittedWorkload,
    ): Promise<DataHistoryCommittedWorkload>;
}

@Injectable()
export class CommittedWorkloadRepository implements ICommittedWorkloadRepo {
    constructor(
        @InjectRepository(CommittedWorkloadEntity)
        protected repo: Repository<CommittedWorkloadEntity>,
        @InjectRepository(ContributedValueEntity)
        protected repoContributed: Repository<ContributedValueEntity>,
        @Inject('IPlannedWorkloadRepo')
        public readonly repoPlanned: IPlannedWorkloadRepo,
    ) {}
    async findByUserId(
        userId: DomainId | number,
        status: CommittedWorkloadStatus = CommittedWorkloadStatus.ACTIVE,
    ): Promise<CommittedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;

        const entities = await this.repo.find({
            where: {
                status,
                user: userId,
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

    async findCommittedActiveAndInComing(
        userId: DomainId | number,
    ): Promise<CommittedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entities = await this.repo.find({
            where: {
                status:
                    CommittedWorkloadStatus.ACTIVE ||
                    CommittedWorkloadStatus.INCOMING,
                user: userId,
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
                status: Not(CommittedWorkloadStatus.INCOMING),
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
    async addCommittedWorkload(
        committedWorkload: CommittedWorkloadEntity[],
        oldCommittedWorkLoad?: CommittedWorkloadEntity[],
    ): Promise<CommittedWorkload[]> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for await (const oldCommit of oldCommittedWorkLoad) {
                await queryRunner.manager.update(
                    CommittedWorkloadEntity,
                    {
                        id: oldCommit.id,
                    },
                    oldCommit,
                );
            }
            const committedWorkloadEntities = await queryRunner.manager.save(
                committedWorkload,
            );
            await queryRunner.commitTransaction();
            return CommittedWorkloadMap.toDomainAll(committedWorkloadEntities);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return null;
        } finally {
            await queryRunner.release();
        }
    }
    async findByUserIdInTimeRange(
        userId: DomainId | number,
        startDateChart: Date,
        endDateChart: Date,
    ): Promise<CommittedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entities = await this.repo.find({
            where: {
                user: { id: userId },
                startDate: LessThan(endDateChart),
                expiredDate: MoreThan(startDateChart),
                status: CommittedWorkloadStatus.ACTIVE,
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

    async findAllCommittedWorkload(
        query: FilterCommittedWorkload,
    ): Promise<PaginationCommittedWorkload> {
        try {
            const queryBuilder = this.repo
                .createQueryBuilder('commit')
                .leftJoinAndSelect(
                    'commit.contributedValue',
                    'contributedValue',
                )
                .leftJoinAndSelect(
                    'contributedValue.expertiseScope',
                    'expertiseScope',
                )
                .leftJoinAndSelect(
                    'contributedValue.valueStream',
                    'valueStream',
                )
                .leftJoinAndSelect('commit.user', 'user')
                .orderBy(`commit.${query.sortBy}`, query.order)
                .skip(query.skip)
                .take(query.take);

            if (query.userId) {
                queryBuilder.andWhere('commit.user.id = :userId', {
                    userId: query.userId,
                });
            }
            if (query.status) {
                queryBuilder.andWhere('commit.status = :status', {
                    status: query.status.toUpperCase(),
                });
            }
            if (query.search) {
                queryBuilder.andWhere('user.alias like :alias', {
                    alias: `%${query.search}%`,
                });
            }

            const entities = await queryBuilder.getMany();
            const itemCount = await queryBuilder.getCount();

            const meta = new PageMetaDto(query, itemCount);
            const data = CommittedWorkloadMap.toDomainAll(entities);
            return new PaginationCommittedWorkload(meta, data);
        } catch (error) {
            return null;
        }
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
                status: CommittedWorkloadStatus.ACTIVE,
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
            await queryRunner.manager.update(
                CommittedWorkloadEntity,
                {
                    expiredDate: now,
                    status:
                        CommittedWorkloadStatus.ACTIVE ||
                        CommittedWorkloadStatus.NOT_RENEW,
                },
                {
                    status: CommittedWorkloadStatus.INACTIVE,
                },
            );
            await queryRunner.manager.update(
                CommittedWorkloadEntity,
                {
                    startDate: now,
                    status: CommittedWorkloadStatus.INCOMING,
                },
                {
                    status: CommittedWorkloadStatus.ACTIVE,
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
                status:
                    CommittedWorkloadStatus.ACTIVE ||
                    CommittedWorkloadStatus.NOT_RENEW,
                user: userId,
                startDate: LessThan(endDateOfWeek),
                expiredDate: MoreThan(startDateOfWeek),
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
            await queryRunner.rollbackTransaction();
            return null;
        } finally {
            await queryRunner.release();
        }
    }
    async findCommittedInComing(userId: number): Promise<CommittedWorkload> {
        const entity = await this.repo.findOne({
            where: {
                user: {
                    id: userId,
                },
                status: CommittedWorkloadStatus.INCOMING,
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'user',
            ],
        });
        return entity ? CommittedWorkloadMap.toDomain(entity) : null;
    }

    async findAllCommittedInComing(
        userId: number,
    ): Promise<CommittedWorkload[]> {
        const entity = await this.repo.find({
            where: {
                user: {
                    id: userId,
                },
                status: CommittedWorkloadStatus.INCOMING,
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'user',
            ],
        });
        return entity ? CommittedWorkloadMap.toDomainAll(entity) : null;
    }

    async findHistoryCommittedWorkload(
        query?: FilterHistoryCommittedWorkload,
    ): Promise<DataHistoryCommittedWorkload> {
        const queryBuilder = this.repo
            .createQueryBuilder('commit')
            .select('user.id', 'userId')
            .addSelect('user.alias', 'alias')
            .addSelect('commit.startDate', 'startDate')
            .addSelect('commit.expiredDate', 'expiredDate')
            .addSelect('commit.status', 'status')
            .addSelect('SUM(commit.committedWorkload)', 'totalCommit')
            .innerJoin('commit.user', 'user')
            .where('commit.status = :status', {
                status: CommittedWorkloadStatus.INACTIVE,
            })
            .groupBy('user.id')
            .addGroupBy('user.alias')
            .addGroupBy('commit.startDate')
            .addGroupBy('commit.expiredDate')
            .addGroupBy('commit.status');
        if (query.userId) {
            queryBuilder.andWhere('commit.user.id = :userId', {
                userId: query.userId,
            });
        }
        if (query.search) {
            queryBuilder.andWhere('user.alias like :alias', {
                alias: `%${query.search}%`,
            });
        }

        const entities = await queryBuilder.getRawMany();

        return new DataHistoryCommittedWorkload(entities);
    }
}

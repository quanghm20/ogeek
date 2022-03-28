import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import {
    Between,
    getConnection,
    LessThan,
    LessThanOrEqual,
    MoreThanOrEqual,
    Repository,
} from 'typeorm';

import { WorkloadStatus } from '../../../common/constants/committed-status';
import { CommittedWorkload } from '../domain/committedWorkload';
import { DomainId } from '../domain/domainId';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { UserEntity } from '../infra/database/entities/user.entity';
import { WorkloadDto } from '../infra/dtos/workload.dto';
import { CommittedWorkloadMap } from '../mappers/committedWorkloadMap';
import { MomentService } from '../useCases/moment/configMomentService/ConfigMomentService';

export interface ICommittedWorkloadRepo {
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
        picId: number,
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
    findAllActiveCommittedWorkload(): Promise<CommittedWorkload[]>;
    findAllExpertiseScope(userId: number, startDate: string): Promise<number[]>;
    findByValueStreamAndExpertiseScope(
        valueStreamId: number,
        expertiseScopeId: number,
        userId: number,
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
                status: WorkloadStatus.ACTIVE,
                user: userId,
                expiredDate: MoreThanOrEqual(new Date()),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'user',
                'pic',
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
    ): Promise<CommittedWorkload[]> {
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
                'pic',
            ],
        });

        return entities
            ? CommittedWorkloadMap.toDomainAll(entities)
            : new Array<CommittedWorkload>();
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
                status: WorkloadStatus.ACTIVE,
            },
            relations: [
                'contributedValue',
                'contributedValue.valueStream',
                'contributedValue.expertiseScope',
                'user',
                'pic',
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
                'pic',
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
        picId: number,
    ): Promise<CommittedWorkload[]> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        try {
            const user = new UserEntity(userId);
            const pic = new UserEntity(picId);
            const result = Array<number>();

            await queryRunner.startTransaction();
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
                const checkOldCommittedWorkload =
                    await this.findByValueStreamAndExpertiseScope(
                        workload.valueStreamId,
                        workload.expertiseScopeId,
                        userId,
                    );
                if (checkOldCommittedWorkload.length > 0) {
                    // set all old committed workload to InActive
                    await this.repo.update(
                        {
                            contributedValue: {
                                valueStream: {
                                    id: workload.valueStreamId,
                                },
                                expertiseScope: {
                                    id: workload.expertiseScopeId,
                                },
                            },
                            user: {
                                id: userId,
                            },
                        },
                        {
                            status: WorkloadStatus.INACTIVE,
                        },
                    );
                }
                const committed = new CommittedWorkloadEntity(
                    user,
                    contribute,
                    workload.workload,
                    startDate,
                    expiredDate,
                    pic,
                );
                const save = await queryRunner.manager.save(committed);
                result.push(save.id);
            }
            await queryRunner.commitTransaction();
            const commits = await this.repo.findByIds(result, {
                relations: [
                    'contributedValue',
                    'contributedValue.valueStream',
                    'contributedValue.expertiseScope',
                    'user',
                    'pic',
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
                'pic',
                'contributedValue.expertiseScope',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.user',
                'committedWorkload.contributedValue.pic',
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
    async findAllActiveCommittedWorkload(): Promise<CommittedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                status: WorkloadStatus.ACTIVE,
            },
            relations: [
                'user',
                'contributedValue',
                'contributedValue.valueStream',
                'contributedValue.expertiseScope',
                'pic',
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
                'pic',
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
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
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
    findAll(): Promise<CommittedWorkload[]>;
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
    ): Promise<number>;
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
            where: { user: { id: userId } },
            relations: [
                'contributedValue',
                'contributedValue.valueStream',
                'contributedValue.expertiseScope',
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
        const entity = await this.repo.findOne(committedWorkloadId, {
            relations: ['contributedValue'],
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
    ): Promise<number> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        try {
            const user = new UserEntity(userId);
            const pic = new UserEntity(picId);

            await queryRunner.startTransaction();
            for await (const workload of committedWorkload) {
                const contribute = await this.repoContributed.findOne({
                    where: {
                        valueStream: {
                            id: workload.valueStreamId,
                        },
                        expertiseScope: { id: workload.expertiseScopeId },
                    },
                });

                const committed = new CommittedWorkloadEntity(
                    user,
                    contribute,
                    workload.workload,
                    startDate,
                    expiredDate,
                    pic,
                );
                await queryRunner.manager.save(committed);
            }
            await queryRunner.commitTransaction();
            return HttpStatus.CREATED;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return HttpStatus.INTERNAL_SERVER_ERROR;
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
                'contributedValue.expertiseScope',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
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
            ],
        });
        return entities ? CommittedWorkloadMap.toDomainAll(entities) : null;
    }

    async findAll(): Promise<CommittedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                status: WorkloadStatus.ACTIVE,
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
}

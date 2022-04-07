import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import {
    Between,
    Connection,
    FindManyOptions,
    getConnection,
    LessThanOrEqual,
    Not,
    Repository,
} from 'typeorm';

import { PlannedWorkloadStatus } from '../../../common/constants/plannedStatus';
import { MomentService } from '../../../providers/moment.service';
import { DomainId } from '../domain/domainId';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { CommittedWorkloadEntity } from '../infra/database/entities';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { InputGetPlanWLDto } from '../infra/dtos/valueStreamsByWeek/inputGetPlanWL.dto';
import { StartEndDateOfWeekWLInputDto } from '../infra/dtos/workloadListByWeek/startEndDateOfWeekInput.dto';
import { PlannedWorkloadMap } from '../mappers/plannedWorkloadMap';

export interface IPlannedWorkloadRepo {
    findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<PlannedWorkload[]>;
    findByUserIdOverview(
        userId: DomainId | number,
        startDateOfYear: string,
        endDateOfYear: string,
    ): Promise<PlannedWorkload[]>;
    findById(plannedWorkloadId: DomainId | number): Promise<PlannedWorkload>;
    findOne(condition: any): Promise<PlannedWorkload>;
    findByIdWithTimeRange(
        userId: DomainId | number,
        startDate: Date,
    ): Promise<PlannedWorkload[]>;
    findByUserId({
        userId,
        startDateOfWeek,
        endDateOfWeek,
    }: InputGetPlanWLDto): Promise<PlannedWorkload[]>;
    find(condition: any): Promise<PlannedWorkload[]>;
    getPlanWLNotClosed({
        startDateOfWeek,
        userId,
    }: InputGetPlanWLDto): Promise<PlannedWorkload>;
    create(entity: PlannedWorkloadEntity): Promise<PlannedWorkload>;
    createMany(entities: PlannedWorkloadEntity[]): Promise<PlannedWorkload[]>;
    updateMany(condition: any, update: any): Promise<void>;
    autoGeneratePlannedWorkloadByCommittedWorkload(
        committedWorkload: CommittedWorkloadEntity,
    ): Promise<PlannedWorkload[]>;
}

@Injectable()
export class PlannedWorkloadRepository implements IPlannedWorkloadRepo {
    constructor(
        @InjectRepository(PlannedWorkloadEntity)
        protected repo: Repository<PlannedWorkloadEntity>,
        private _connection: Connection,
    ) {}

    async findByUserIdOverview(
        userId: DomainId | number,
        startDateOfYear: string,
        endDateOfYear: string,
    ): Promise<PlannedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.find({
            where: {
                user: { id: userId },
                startDate: Between(startDateOfYear, endDateOfYear),
                status: !PlannedWorkloadStatus.ARCHIVE,
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
                'committedWorkload.user',
                'user',
            ],
        });

        return entity ? PlannedWorkloadMap.toArrayDomain(entity) : null;
    }

    async findById(
        plannedWorkloadId: DomainId | number,
    ): Promise<PlannedWorkload> {
        plannedWorkloadId =
            plannedWorkloadId instanceof DomainId
                ? Number(plannedWorkloadId.id.toValue())
                : plannedWorkloadId;
        const entity = await this.repo.findOne(plannedWorkloadId);
        return entity ? PlannedWorkloadMap.toDomain(entity) : null;
    }

    async create(entity: PlannedWorkloadEntity): Promise<PlannedWorkload> {
        const savedEntity = await this.repo.save(entity);
        return savedEntity ? PlannedWorkloadMap.toDomain(entity) : null;
    }

    async createMany(
        entities: PlannedWorkloadEntity[],
    ): Promise<PlannedWorkload[]> {
        const queryRunner = this._connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const plannedWorkloadEntities = await queryRunner.manager.save(
                PlannedWorkloadEntity,
                entities,
            );
            await queryRunner.commitTransaction();
            return plannedWorkloadEntities ||
                plannedWorkloadEntities.length === 0
                ? PlannedWorkloadMap.toDomainAll(plannedWorkloadEntities)
                : null;
        } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
    }

    async findByUserId({
        startDateOfWeek,
        endDateOfWeek,
        userId,
    }: InputGetPlanWLDto): Promise<PlannedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                status: Not(PlannedWorkloadStatus.ARCHIVE),
                user: {
                    id: Number(userId),
                },
                startDate: Between(startDateOfWeek, endDateOfWeek),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'user',
                'committedWorkload.user',
            ],
        });
        return entities
            ? PlannedWorkloadMap.toDomainAll(entities)
            : new Array<PlannedWorkload>();
    }

    async getPlanWLNotClosed({
        startDateOfWeek,
        userId,
    }: InputGetPlanWLDto): Promise<PlannedWorkload> {
        const entitie = await this.repo.findOne({
            where: {
                status:
                    PlannedWorkloadStatus.PLANNING ||
                    PlannedWorkloadStatus.EXECUTING,
                user: userId,
                endDate: LessThanOrEqual(startDateOfWeek),
            },
        });
        return entitie ? PlannedWorkloadMap.toDomain(entitie) : null;
    }

    async find(condition: any): Promise<PlannedWorkload[]> {
        const entities = await this.repo.find({
            where: condition as FindManyOptions<PlannedWorkload>,
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
                'user',
                'committedWorkload.user',
            ],
        });
        return entities ? PlannedWorkloadMap.toDomainAll(entities) : null;
    }

    async findOne(condition: any): Promise<PlannedWorkload> {
        const entities = await this.repo.findOne({
            where: condition as FindManyOptions<PlannedWorkload>,
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
                'user',
                'committedWorkload.user',
            ],
        });
        return entities ? PlannedWorkloadMap.toDomain(entities) : null;
    }

    async findByIdWithTimeRange(
        userId: DomainId | number,
        startDate: Date,
    ): Promise<PlannedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                user: {
                    id: Number(userId),
                },
                startDate: Between(
                    MomentService.shiftFirstDateChart(startDate),
                    MomentService.shiftLastDateChart(startDate),
                ),
                status: Not(PlannedWorkloadStatus.ARCHIVE),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
                'user',
                'committedWorkload.user',
            ],
        });
        return entities ? PlannedWorkloadMap.toDomainAll(entities) : null;
    }

    async updateMany(condition: any, update: any): Promise<void> {
        await this.repo.update(condition, update);
    }

    async findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<PlannedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                status: Not(PlannedWorkloadStatus.ARCHIVE),
                startDate: Between(startDateOfWeek, endDateOfWeek),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.user',
                'user',
            ],
        });

        return entities
            ? PlannedWorkloadMap.toDomainAll(entities)
            : new Array<PlannedWorkload>();
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

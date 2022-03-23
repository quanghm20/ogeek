import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { CommittedWorkload } from '../domain/committedWorkload';
import { DomainId } from '../domain/domainId';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { UserEntity } from '../infra/database/entities/user.entity';
import { WorkloadDto } from '../infra/dtos/workload.dto';
import { CommittedWorkloadMap } from '../mappers/committedWorkloadMap';

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
    ): Promise<string>;
}

@Injectable()
export class CommittedWorkloadRepository implements ICommittedWorkloadRepo {
    constructor(
        @InjectRepository(CommittedWorkloadEntity)
        protected repo: Repository<CommittedWorkloadEntity>,
        @InjectRepository(ContributedValueEntity)
        protected repoContributed: Repository<ContributedValueEntity>,
    ) {}

    async findById(
        committedWorkloadId: DomainId | number,
    ): Promise<CommittedWorkload> {
        committedWorkloadId =
            committedWorkloadId instanceof DomainId
                ? Number(committedWorkloadId.id.toValue())
                : committedWorkloadId;
        const entity = await this.repo.findOne(committedWorkloadId);
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
    ): Promise<string> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        try {
            const user = new UserEntity(userId);
            const pic = new UserEntity(picId);
            await queryRunner.startTransaction();
            for await (const workload of committedWorkload) {
                const contributes = await this.repoContributed.find({
                    where: {
                        valueStream: {
                            id: workload.valueStreamId,
                        },
                        expertiseScope: { id: workload.expertiseScopeId },
                    },
                    take: 1,
                });

                const committed = new CommittedWorkloadEntity(
                    user,
                    contributes[0],
                    workload.workload,
                    startDate,
                    expiredDate,
                    pic,
                );
                await queryRunner.manager.save(committed);
            }
            await queryRunner.commitTransaction();
            return 'ok';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return '500';
        }
    }
}

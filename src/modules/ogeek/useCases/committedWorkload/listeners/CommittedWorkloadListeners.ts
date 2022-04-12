import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { CommittedWorkloadCreatedEvent } from '../events/CommittedWorkloadEvent';
@Injectable()
export class CommittedWorkloadCreatedListener {
    constructor(
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
    ) {}

    @OnEvent('committed-workload.created')
    async handleCommittedWorkloadCreatedEvent(
        committedEvent: CommittedWorkloadCreatedEvent,
    ): Promise<void> {
        for (const commit of committedEvent.committedWorkloads) {
            const plannedDomain = commit.autoGeneratePlanned();

            const plannedEntities =
                PlannedWorkloadMap.toEntities(plannedDomain);
            await this.plannedWorkloadRepo.createMany(plannedEntities);
        }

        for (const oldCommit of committedEvent.oldCommittedWorkloads) {
            let plans = await this.plannedWorkloadRepo.findByCommittedId(
                oldCommit.id.toValue(),
            );

            if (plans) {
                plans = oldCommit.autoArchivePlannedWorkload(
                    committedEvent.startDate,
                    plans,
                );
                const plannedEntities = PlannedWorkloadMap.toEntities(plans);

                await this.plannedWorkloadRepo.createMany(plannedEntities);
            }
        }
    }
}

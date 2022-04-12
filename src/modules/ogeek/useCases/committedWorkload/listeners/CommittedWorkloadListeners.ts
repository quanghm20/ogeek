import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationStatus } from '../../../../../common/constants/notificationStatus';
import { SYSTEM } from '../../../../../common/constants/system';
import { Notification } from '../../../../ogeek/domain/notification';
import { NotificationMap } from '../../../../ogeek/mappers/notificationMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { INotificationRepo } from '../../../repos/notificationRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { CommittedWorkloadCreatedEvent } from '../events/CommittedWorkloadEvent';
@Injectable()
export class CommittedWorkloadCreatedListener {
    constructor(
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
        @Inject('INotificationRepo')
        public readonly notificationRepo: INotificationRepo,
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

        const committedWorkload = committedEvent.committedWorkloads[0];
        const user = committedWorkload.user;

        const message = `Admin has added ${committedWorkload.committedWorkload} hr(s) committed workload for you.`;
        const notification = Notification.create({
            message,
            user,
            read: NotificationStatus.UNREAD,
            createdBy: SYSTEM,
            updatedBy: SYSTEM,
        });

        const notificationEntity = NotificationMap.toEntity(
            notification.getValue(),
        );

        await this.notificationRepo.save(notificationEntity);
    }
}

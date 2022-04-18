import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationStatus } from '../../../../../common/constants/notificationStatus';
import { SYSTEM } from '../../../../../common/constants/system';
import { CommittedWorkload } from '../../../../ogeek/domain/committedWorkload';
import { Notification } from '../../../../ogeek/domain/notification';
import { NotificationMap } from '../../../mappers/notificationMap';
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
            let plans =
                await this.plannedWorkloadRepo.findByCommittedIdAndStartDate(
                    oldCommit.id.toValue(),
                    committedEvent.startDate,
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
        const committedWorkload = committedEvent.committedWorkloads.find(
            (committedWl) => committedWl,
        );
        const user = committedWorkload.user;
        const sumCommit = committedEvent.committedWorkloads.reduce(
            (prev, curr) => prev + curr.committedWorkload,
            0,
        );

        const notificationMessage = `Admin has added ${sumCommit} hr(s) committed workload for you.`;
        const notification = Notification.create({
            notificationMessage,
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

    @OnEvent('committed-workload.updated')
    async handleCommittedWorkloadUpdatedEvent(
        committedEvent: CommittedWorkloadCreatedEvent,
    ): Promise<void> {
        for (const commit of committedEvent.committedWorkloads) {
            const plannedDomain = commit.autoGeneratePlanned();

            const plannedEntities =
                PlannedWorkloadMap.toEntities(plannedDomain);
            await this.plannedWorkloadRepo.createMany(plannedEntities);
        }

        for (const oldCommit of committedEvent.oldCommittedWorkloads) {
            let plans =
                await this.plannedWorkloadRepo.findByCommittedIdAndStartDate(
                    oldCommit.id.toValue(),
                    committedEvent.startDate,
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
        const sumCommit = committedEvent.committedWorkloads.reduce(
            (prev, curr) => prev + curr.committedWorkload,
            0,
        );

        const notificationMessage = `Admin has updated ${sumCommit} hr(s) committed workload for you.`;
        const notification = Notification.create({
            notificationMessage,
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

    @OnEvent('committed-workload.deleted')
    async handleCommittedWorkloadDeletedEvent(
        commitment: CommittedWorkload,
    ): Promise<void> {
        let plans = await this.plannedWorkloadRepo.findByCommittedId(
            commitment.id.toValue(),
        );

        if (plans) {
            plans = commitment.setArchivePlannedWorkload(plans);
            const plannedEntities = PlannedWorkloadMap.toEntities(plans);
            await this.plannedWorkloadRepo.createMany(plannedEntities);
        }

        const notificationMessage = `${commitment.committedWorkload} hrs of your commitment for
		${commitment.contributedValue.expertiseScope.name} (${commitment.contributedValue.valueStream.name}) has been deleted.`;
        const notification = Notification.create({
            notificationMessage,
            user: commitment.props.user,
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

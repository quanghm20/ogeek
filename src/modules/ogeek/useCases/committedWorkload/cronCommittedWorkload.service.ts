import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ICommittedWorkloadRepo } from '../../repos/committedWorkloadRepo';
@Injectable()
export class CronCommittedWorkload {
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    ) {}
    @Cron('0 0 0 * * *') // update everyday at 00:00
    async autoUpdateStatusCommitted(): Promise<void> {
        try {
            await this.committedWorkloadRepo.updateCommittedWorkloadExpired();
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
}

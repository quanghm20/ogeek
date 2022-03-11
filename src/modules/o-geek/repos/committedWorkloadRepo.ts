import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';

@EntityRepository(CommittedWorkloadEntity)
export class CommittedWorkloadRepository extends Repository<CommittedWorkloadEntity> {}

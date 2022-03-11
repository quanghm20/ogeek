import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';

@EntityRepository(PlannedWorkloadEntity)
export class PlannedWorkloadRepository extends Repository<PlannedWorkloadEntity> {}

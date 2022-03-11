import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { ValueStreamEntity } from '../infra/database/entities/valueStream.entity';

@EntityRepository(ValueStreamEntity)
export class ValueStreamRepository extends Repository<ValueStreamEntity> {}

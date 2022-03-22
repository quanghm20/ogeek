import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { ValueStream } from '../domain/valueStream';
import { ValueStreamEntity } from '../infra/database/entities/valueStream.entity';
import { ValueStreamMap } from '../mappers/valueStreamMap';

export interface IValueStreamRepo {
    findById(valueStreamId: DomainId | number): Promise<ValueStream>;
    findAll(): Promise<ValueStream[]>;
}

@Injectable()
export class ValueStreamRepository implements IValueStreamRepo {
    constructor(
        @InjectRepository(ValueStreamEntity)
        protected repo: Repository<ValueStreamEntity>,
    ) {}

    async findById(valueStreamId: DomainId | number): Promise<ValueStream> {
        valueStreamId =
            valueStreamId instanceof DomainId
                ? Number(valueStreamId.id.toValue())
                : valueStreamId;
        const entity = await this.repo.findOne(valueStreamId);
        return entity ? ValueStreamMap.toDomain(entity) : null;
    }

    async findAll(): Promise<ValueStream[]> {
        const entities = await this.repo.find();
        return entities ? ValueStreamMap.toDomainAll(entities) : null;
    }
}

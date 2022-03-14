'use strict';

import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
    id: UniqueEntityID;
    createdAt: Date;
    updatedAt: Date;

    constructor(entity: AbstractEntity) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}

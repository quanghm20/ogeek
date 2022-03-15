import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { ExpertiseScopeEntity } from '../database/entities/expertiseScope.entity';
export class ExpertiseScopeDto {
    @ApiProperty()
    id: UniqueEntityID;

    @ApiProperty()
    name?: string;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
    constructor(expertiseScope: ExpertiseScopeEntity) {
        this.id = new UniqueEntityID(expertiseScope.id);
        this.name = expertiseScope.name;
        this.createdAt = expertiseScope.createdAt;
        this.updatedAt = expertiseScope.updatedAt;
    }
}

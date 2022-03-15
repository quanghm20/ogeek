import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { ExpertiseScopeEntity } from '../database/entities/expertiseScope.entity';
export class ExpertiseScopeDto {
    @ApiProperty({ example: 135 })
    id: UniqueEntityID;

    @ApiProperty({ example: 'Product UI' })
    name?: string;

    @ApiProperty({ example: new Date() })
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;
    constructor(expertiseScope: ExpertiseScopeEntity) {
        this.id = new UniqueEntityID(expertiseScope.id);
        this.name = expertiseScope.name;
        this.createdAt = expertiseScope.createdAt;
        this.updatedAt = expertiseScope.updatedAt;
    }
}

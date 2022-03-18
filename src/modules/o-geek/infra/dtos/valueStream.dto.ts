import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { ValueStreamEntity } from '../database/entities/valueStream.entity';
export class ValueStreamDto {
    @ApiProperty({
        type: () => UniqueEntityID,
        example: new UniqueEntityID(2291),
    })
    id: UniqueEntityID;

    @ApiProperty({ example: 'Delivery' })
    name?: string;

    @ApiProperty({ example: new Date() })
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;

    constructor(valueStream: ValueStreamEntity) {
        this.id = new UniqueEntityID(valueStream.id);
        this.name = valueStream.name;
        this.createdAt = valueStream.createdAt;
        this.updatedAt = valueStream.updatedAt;
    }
}

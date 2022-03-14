import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
export class ExpertiseScopeDto {
    @ApiProperty()
    id: UniqueEntityID | number;

    @ApiProperty()
    name?: string;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

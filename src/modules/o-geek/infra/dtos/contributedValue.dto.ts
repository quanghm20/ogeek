import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { ExpertiseScopeDto } from './expertiseScope.dto';
import { ValueStreamDto } from './valueStream.dto';
export class ContributedValueDto {
    @ApiProperty()
    id: UniqueEntityID | number;

    @ApiProperty()
    valueStream: ValueStreamDto;

    @ApiProperty()
    expertiseScope: ExpertiseScopeDto;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class ContributedValueDto {
    @ApiProperty()
    expertiseScopeId: UniqueEntityID;

    @ApiProperty()
    valueStreamId: UniqueEntityID;
}

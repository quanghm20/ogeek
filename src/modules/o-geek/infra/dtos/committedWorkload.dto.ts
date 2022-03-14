import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class CommittedWorkloadDto {
    @ApiProperty()
    id?: UniqueEntityID;

    @ApiProperty()
    userId?: UniqueEntityID;

    @ApiProperty()
    contributedValueId?: UniqueEntityID;

    @ApiProperty()
    committedWorkload?: number;

    @ApiProperty()
    startDate?: Date;

    @ApiProperty()
    expiredDate?: Date;

    @ApiProperty()
    isActive?: boolean;
}

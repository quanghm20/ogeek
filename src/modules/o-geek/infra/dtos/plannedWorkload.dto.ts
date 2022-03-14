import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class PlannedWorkloadDto {
    @ApiProperty()
    id?: UniqueEntityID;

    @ApiProperty()
    userId: UniqueEntityID;

    @ApiProperty()
    contributedValueId?: UniqueEntityID;

    @ApiProperty()
    committedWorkloadId?: UniqueEntityID;

    @ApiProperty()
    plannedWorkload?: number;

    @ApiProperty()
    startDate?: Date;

    @ApiProperty()
    isActive?: boolean;

    @ApiProperty()
    reason?: string;
}

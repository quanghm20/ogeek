import { ApiProperty } from '@nestjs/swagger';

export class CreatePlannedWorkloadItemDto {
    @ApiProperty()
    workload?: number;

    @ApiProperty()
    committedWorkloadId?: number;

    @ApiProperty()
    contributedValueId?: number;
}

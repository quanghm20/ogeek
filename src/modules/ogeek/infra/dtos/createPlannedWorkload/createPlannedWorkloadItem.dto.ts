import { ApiProperty } from '@nestjs/swagger';

export class CreatePlannedWorkloadItemDto {
    @ApiProperty({ example: 20 })
    workload?: number;

    @ApiProperty({ example: 'Product Backend' })
    committedWorkloadId?: number;

    // @ApiProperty({ example: 1 })
    // contributedValueId?: number;
}

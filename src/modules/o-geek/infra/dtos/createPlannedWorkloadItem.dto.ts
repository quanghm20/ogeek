import { ApiProperty } from '@nestjs/swagger';

export class CreatePlannedWorkloadItemDto {
    @ApiProperty()
    workload?: number;

    @ApiProperty()
    committedWorloadId?: number;

    @ApiProperty()
    expertiseScopeId?: number;

    @ApiProperty()
    valueStreamId?: number;
}

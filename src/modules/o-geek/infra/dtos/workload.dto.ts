import { ApiProperty } from '@nestjs/swagger';
export class WorkloadDto {
    @ApiProperty({ example: 1 })
    valueStreamId: number;

    @ApiProperty({ example: 3 })
    expertiseScopeId: number;

    @ApiProperty({ example: 40 })
    workload: number;
}

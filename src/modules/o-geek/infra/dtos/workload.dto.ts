import { ApiProperty } from '@nestjs/swagger';
export class WorkloadDto {
    @ApiProperty({ example: 2 })
    valueStreamId: number;

    @ApiProperty({ example: 10 })
    expertiseScopeId: number;

    @ApiProperty({ example: 40 })
    workload: number;
}

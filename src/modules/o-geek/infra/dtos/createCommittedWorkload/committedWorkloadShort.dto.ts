import { ApiProperty } from '@nestjs/swagger';

export class CommittedWorkloadShortDto {
    @ApiProperty({ example: 10 })
    userId: number;

    @ApiProperty({ example: 12 })
    valueStreamId: number;

    @ApiProperty({ example: 11 })
    expertiseScopeId: number;

    @ApiProperty({ example: 4 })
    committedWorkload: number;

    @ApiProperty({ example: new Date() })
    startDate: Date;

    @ApiProperty({ example: new Date() })
    expiredDate: Date;

    constructor(
        userId?: number,
        valueStreamId?: number,
        expertiseScopeId?: number,
        committedWorkload?: number,
        startDate?: Date,
        expiredDate?: Date,
    ) {
        this.userId = userId;
        this.valueStreamId = valueStreamId;
        this.expertiseScopeId = expertiseScopeId;
        this.committedWorkload = committedWorkload;
        this.startDate = startDate;
        this.expiredDate = expiredDate;
    }
}

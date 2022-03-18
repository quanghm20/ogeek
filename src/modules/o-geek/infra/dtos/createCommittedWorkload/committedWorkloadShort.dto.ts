import { ApiProperty } from '@nestjs/swagger';

export class CommittedWorkloadShortDto {
    @ApiProperty({ example: 10 })
    userId: number;

    @ApiProperty({ example: 12 })
    contributedValueId: number;

    @ApiProperty({ example: 4 })
    committedWorkload: number;

    @ApiProperty({ example: new Date() })
    startDate: Date;

    @ApiProperty({ example: new Date() })
    expiredDate: Date;

    constructor(
        userId?: number,
        contributedValueId?: number,
        committedWorkload?: number,
        startDate?: Date,
        expiredDate?: Date,
    ) {
        this.userId = userId;
        this.contributedValueId = contributedValueId;
        this.committedWorkload = committedWorkload;
        this.startDate = startDate;
        this.expiredDate = expiredDate;
    }
}

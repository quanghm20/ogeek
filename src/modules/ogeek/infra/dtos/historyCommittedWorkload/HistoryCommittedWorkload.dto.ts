import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { UserCompactDto } from '../getCommittedWorkload/getCommittedWorkloadShort.dto';

export class UserCommittedWorkload {
    @ApiProperty({
        type: UserCompactDto,
    })
    user: UserCompactDto;

    @ApiProperty({
        type: Number,
        description: 'Summary committed workload',
    })
    totalCommit: number;

    @ApiProperty({ example: new Date() })
    startDate: Date;

    @ApiProperty({ example: new Date() })
    expiredDate: Date;
}

export class DataHistoryCommittedWorkload {
    @ApiProperty({
        type: UserCommittedWorkload,
        isArray: true,
    })
    data: UserCommittedWorkload[];

    @ApiPropertyOptional()
    meta?: PageMetaDto;

    constructor(data: UserCommittedWorkload[], meta?: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}

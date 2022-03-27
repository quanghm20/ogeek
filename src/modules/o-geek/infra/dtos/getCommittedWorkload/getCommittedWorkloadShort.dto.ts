import { ApiProperty } from '@nestjs/swagger';

import { WorkloadStatus } from '../../../../../common/constants/committed-status';
import { ExpertiseScopeShortDto } from '../getContributedValue/expertiseScopeShort.dto';
import { ValueStreamShortDto } from '../summaryYearDTO/valueStreamShort.dto';
export class UserCompactDto {
    @ApiProperty({ example: 1 })
    id?: number;

    @ApiProperty({ example: 'thai.ls' })
    alias?: string;

    @ApiProperty({ example: 'Sỹ Thái' })
    name: string;

    constructor(id?: number, alias?: string, name?: string) {
        this.id = id;
        this.alias = alias;
        this.name = name;
    }
}

export class CommittedWorkloadShortDto {
    @ApiProperty({ type: UserCompactDto })
    user: UserCompactDto;

    @ApiProperty({ type: ValueStreamShortDto })
    valueStream: ValueStreamShortDto;

    @ApiProperty({ type: ExpertiseScopeShortDto })
    expertiseScope: ExpertiseScopeShortDto;

    @ApiProperty({ example: 40 })
    committedWorkload: number;

    @ApiProperty({ example: new Date('2022-01-01') })
    startDate: Date;

    @ApiProperty({ example: new Date('2022-06-30') })
    expiredDate: Date;

    @ApiProperty({
        enum: WorkloadStatus,
        example: WorkloadStatus.ACTIVE,
    })
    status: WorkloadStatus;

    @ApiProperty({ example: new Date() })
    createdAt: Date;
}

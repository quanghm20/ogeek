import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

import { CommittingWorkloadStatus } from '../../../../../../common/constants/committingStatus';

export class UserCommittingWorkload {
    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'ERROR_EMPTY_ID_FIELD' })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'quang.hm' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_ALIAS_FIELD' })
    @IsString()
    alias: string;

    @ApiProperty({ example: 'Minh Quang' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_NAME_FIELD' })
    @IsString()
    name: string;
}

export class ListCommttingWorkload {
    @ApiProperty({ type: UserCommittingWorkload })
    user: UserCommittingWorkload;

    @ApiProperty({
        type: Number,
        description: 'Summary committed workload',
    })
    totalCommit: number;

    @ApiProperty({
        enum: CommittingWorkloadStatus,
        example: CommittingWorkloadStatus.UNHANDLED,
    })
    @IsNotEmpty({ message: 'ERROR_EMPTY_STATUS_FIELD' })
    status: CommittingWorkloadStatus;

    @ApiProperty({ example: 50 })
    @IsNumber()
    @IsNotEmpty({ message: 'ERROR_EMPTY_DAYS_OF_EXPIRES_FIELD' })
    daysUntilExpire: number;

    @ApiProperty({ example: new Date() })
    @IsString()
    @IsNotEmpty({ message: 'ERROR_EMPTY_START_DATE_FIELD' })
    startDate: Date;

    @ApiProperty({ example: new Date() })
    @IsString()
    @IsNotEmpty({ message: 'ERROR_EMPTY_EXPIRED_DATE_FIELD' })
    expiredDate: Date;
}

export class DataListCommittingWorkload {
    @ApiProperty({
        type: ListCommttingWorkload,
    })
    data: UserCommittingWorkload[];

    constructor(data: UserCommittingWorkload[]) {
        this.data = data;
    }
}
export class FilterListCommittingWorkload {
    @ApiPropertyOptional({
        description: 'Filter by Status',
    })
    @Type(() => String)
    @IsOptional()
    @IsInt()
    status?: CommittingWorkloadStatus;

    @ApiPropertyOptional({
        description: 'Search data by alias',
    })
    @Type(() => String)
    @IsOptional()
    search?: string;
}

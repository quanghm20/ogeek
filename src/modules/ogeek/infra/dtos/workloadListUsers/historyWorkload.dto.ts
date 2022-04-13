import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';
import { HistoryActualWorkloadDto } from './historyActualWorkload.dto';

export class HistoryWorkloadDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    userId: number;

    @ApiProperty({ example: 'tuan.lq' })
    @IsString()
    alias: string;

    @ApiProperty({ example: 'https://avatar.com' })
    @IsString()
    avatar: string;

    @ApiProperty({ example: IssueStatus.POTENTIAL_ISSUE })
    @IsString()
    status: string;

    @ApiProperty({ example: "If I like it, I'll mark it" })
    @IsString()
    note: string;

    @ApiProperty({ example: 40 })
    @IsNumber()
    @Type(() => Number)
    committed: number;

    @ApiProperty({ type: HistoryActualWorkloadDto })
    @IsArray()
    actualWorkloads?: HistoryActualWorkloadDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { IssueType } from '../../../../../common/constants/issue-type';
import { CommittedWorkloadByWeekDto } from './committedWorkloadOfWeek.dto';
import { ExpertiseScopeWithinWorkloadListDto } from './expertiseScopeWithinWorkloadList.dto';
import { UserWorkloadDto } from './userWorkload.dto';

export class WorkloadListByWeekDto {
    @ApiProperty({ type: UserWorkloadDto })
    @IsNotEmpty()
    user: UserWorkloadDto;

    @ApiProperty({ type: ExpertiseScopeWithinWorkloadListDto, isArray: true })
    @IsArray()
    @IsNotEmpty()
    expertiseScopes: ExpertiseScopeWithinWorkloadListDto[];

    @ApiProperty({ type: CommittedWorkloadByWeekDto })
    @IsNotEmpty()
    committedWorkload: CommittedWorkloadByWeekDto;

    @ApiProperty({ example: 20 })
    @IsNumber()
    @IsNotEmpty()
    plannedWorkload: number;

    @ApiProperty({ example: 18 })
    @IsNumber()
    @IsNotEmpty()
    actualWorkload: number;

    @ApiProperty({ enum: IssueType, example: IssueType.NOT_ISSUE })
    @IsString()
    @IsNotEmpty()
    issueType: IssueType;
}

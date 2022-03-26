import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { IssueType } from '../../../../../common/constants/issue-type';
import { CommittedWorkloadByWeekDto } from './committedWorkloadOfWeek.dto';
import { ExpertiseScopeWithinWorkloadListDto } from './expertiseScopeWithinWorkloadList.dto';
import { UserWorkloadDto } from './userWorkload.dto';

export class WorkloadListByWeekDto {
    @ApiProperty({ type: UserWorkloadDto })
    user: UserWorkloadDto;

    @ApiProperty({ type: ExpertiseScopeWithinWorkloadListDto, isArray: true })
    @IsArray()
    expertiseScopes: ExpertiseScopeWithinWorkloadListDto[];

    @ApiProperty({ type: CommittedWorkloadByWeekDto })
    committedWorkload: CommittedWorkloadByWeekDto;

    @ApiProperty({ example: 20 })
    @IsNumber()
    plannedWorkload: number;

    @ApiProperty({ example: 18 })
    @IsNumber()
    actualWorkload: number;

    @ApiProperty({ enum: IssueType, example: IssueType.NOT_ISSUE })
    @IsString()
    issueType: IssueType;
}

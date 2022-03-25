import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { CommittedWorkloadByWeekDto } from './committedWorkloadOfWeek.dto';
import { ExpertiseScopeWithinWorkloadListDto } from './expertiseScopeWithinWorkloadList.dto';
import { UserWorkloadDto } from './userWorkload.dto';

export class WorkloadListByWeekDto {
    @ApiProperty()
    user: UserWorkloadDto;

    @ApiProperty()
    @IsArray()
    expertiseScopes: ExpertiseScopeWithinWorkloadListDto[];

    @ApiProperty()
    committedWorkload: CommittedWorkloadByWeekDto;

    @ApiProperty()
    @IsNumber()
    plannedWorkload: number;

    @ApiProperty()
    @IsNumber()
    actualWorkload: number;

    @ApiProperty()
    @IsString()
    typeOfIssue: string;
}

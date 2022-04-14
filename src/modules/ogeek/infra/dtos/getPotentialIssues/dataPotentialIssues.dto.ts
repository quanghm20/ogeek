import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';
import { CommittedWorkloadDto } from '../committedWorkload.dto';
import { ActualWorkloadDto } from '../overviewChart/actualWorkload.dto';
import { PlannedWorkloadDto } from '../plannedWorkload.dto';

export class RawDataPotentialIssuesDto {
    @ApiProperty()
    dayOfWeek: Date;

    @ApiProperty()
    committedWorkloads: CommittedWorkloadDto[];

    @ApiProperty()
    plannedWorkloads: PlannedWorkloadDto[];

    @ApiProperty()
    actualWorkloads: ActualWorkloadDto[];

    @ApiProperty()
    issueStatus: IssueStatus;

    @ApiProperty()
    @IsString()
    note: string;
}

export class DataPotentialIssuesDto {
    @ApiProperty()
    week: number;

    @ApiProperty()
    committedWorkload: number;

    @ApiProperty()
    plannedWorkload: number;

    @ApiProperty()
    actualWorkload: number;

    @ApiProperty()
    issueStatus: IssueStatus;

    @ApiProperty()
    @IsString()
    note: string;
}

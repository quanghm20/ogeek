import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class PotentialIssueDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 56 })
    userId: number;

    @ApiProperty({ enum: IssueStatus, example: 'POTENTIAL ISSUE' })
    @IsString()
    @IsNotEmpty()
    status: IssueStatus;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    note: string;

    @IsDate()
    @ApiProperty()
    @IsNotEmpty()
    firstDateOfWeek: Date;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    createdAt: Date;
}

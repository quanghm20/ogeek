import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class CreateIssueDto {
    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 12 })
    @IsNumber()
    @IsNotEmpty()
    week: number;

    @ApiProperty({ enum: IssueStatus, example: null })
    @IsString()
    @IsNotEmpty()
    type: IssueStatus;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    picId?: number;
}

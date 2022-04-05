import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { IssueType } from '../../../../../common/constants/issue-type';

export class CreateIssueDto {
    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 12 })
    @IsNumber()
    @IsNotEmpty()
    week: number;

    @ApiProperty({ enum: IssueType, example: null })
    @IsString()
    @IsNotEmpty()
    type: IssueType;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    picId?: number;
}

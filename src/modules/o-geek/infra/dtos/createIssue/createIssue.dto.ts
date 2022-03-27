import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { IssueType } from '../../../../../common/constants/issue-type';

export class CreateIssueDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    userId: number;

    @ApiProperty({ example: 12 })
    @IsNumber()
    week: number;

    @ApiProperty({ enum: IssueType, example: IssueType.ISSUE })
    @IsString()
    type: IssueType;

    picId?: number;
}

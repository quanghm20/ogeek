import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class UpdatePotentialIssueDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ enum: IssueStatus, example: IssueStatus.RESOLVED })
    @IsString()
    @IsOptional()
    status?: IssueStatus;

    @ApiProperty({
        example: 'Resolve potential issue.',
    })
    @IsString()
    @IsOptional()
    note?: string;
}

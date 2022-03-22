import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ContributedValueDto {
    @ApiProperty({ example: 'Product Backend' })
    @IsString()
    expertiseScope: string;

    @ApiProperty({ example: '1' })
    @IsNumber()
    expertiseScopeId: number;

    @ApiProperty({ example: '20' })
    @IsNumber()
    committedWorkload: number;

    @ApiProperty({ example: '12' })
    @IsNumber()
    plannedWorkload: number;

    @ApiProperty({ example: '12' })
    @IsNumber()
    actualPlannedWorkload: number;

    @ApiProperty({ example: '10' })
    @IsString()
    worklog: number;
}

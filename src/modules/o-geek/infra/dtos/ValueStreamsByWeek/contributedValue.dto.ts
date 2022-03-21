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
    committedWorkLoad: number;

    @ApiProperty({ example: '12' })
    @IsNumber()
    plannedWorkLoad: number;

    @ApiProperty({ example: '12' })
    @IsNumber()
    actualPlannedWorkLoad: number;

    @ApiProperty({ example: '10' })
    @IsString()
    worklog: number;
}

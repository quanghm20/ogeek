import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ContributedValueDto {
    @ApiProperty()
    @IsString()
    expertiseScope: string;

    @ApiProperty()
    @IsNumber()
    expertiseScopeId: number;

    @ApiProperty()
    @IsNumber()
    committedWorkLoad: number;

    @ApiProperty()
    @IsNumber()
    plannedWorkLoad: number;

    @ApiProperty()
    @IsNumber()
    actualPlannedWorkLoad: number;

    @ApiProperty()
    @IsString()
    worklog: number;
}

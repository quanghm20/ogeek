import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ActualPlanAndWorkLogDto {
    @ApiProperty()
    @IsString()
    valueStream: string;

    @ApiProperty()
    @IsNumber()
    contributedValueId: number;

    @ApiProperty()
    @IsString()
    expertiseScope: string;

    @ApiProperty()
    @IsNumber()
    valueStreamId: number;

    @ApiProperty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNumber()
    actualPlan: number;

    @ApiProperty()
    @IsNumber()
    workLog: number;
}

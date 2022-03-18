import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class ActualPlanAndWorkLogDto {
    @ApiProperty()
    @IsString()
    valueStream: string;

    @ApiProperty()
    @IsNumber()
    contributedValueId: number | UniqueEntityID;

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

    @ApiProperty()
    @IsString()
    week: string;
}

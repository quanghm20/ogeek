import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { CreatePlannedWorkloadItemDto } from './createPlannedWorkloadItem.dto';

export class CreatePlannedWorkloadsListDto {
    @IsNumber()
    @ApiProperty()
    userId?: number;

    @IsString()
    @ApiProperty()
    startDate?: Date;

    @IsString()
    @ApiProperty()
    reason?: string;

    @IsArray()
    @ApiProperty()
    plannedWorkloads?: CreatePlannedWorkloadItemDto[];
}

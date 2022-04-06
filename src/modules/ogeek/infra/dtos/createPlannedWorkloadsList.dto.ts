import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { CreatePlannedWorkloadItemDto } from './createPlannedWorkloadItem.dto';

export class CreatePlannedWorkloadsListDto {
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

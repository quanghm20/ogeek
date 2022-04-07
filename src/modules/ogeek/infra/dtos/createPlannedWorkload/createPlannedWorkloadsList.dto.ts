import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmpty, IsString } from 'class-validator';

import { CreatePlannedWorkloadItemDto } from './createPlannedWorkloadItem.dto';

export class CreatePlannedWorkloadsListDto {
    @IsString()
    @IsEmpty()
    @ApiProperty()
    startDate?: Date;

    @IsEmpty()
    @IsString()
    @ApiProperty({ example: 'Early Bird' })
    reason?: string;

    @IsArray()
    @ApiProperty({ isArray: true, type: CreatePlannedWorkloadItemDto })
    plannedWorkloads?: CreatePlannedWorkloadItemDto[];
}

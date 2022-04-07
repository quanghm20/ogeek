import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty } from 'class-validator';

import { WorkloadDto } from './workload.dto';

export class CreateCommittedWorkloadDto {
    @ApiProperty({ type: () => WorkloadDto, isArray: true })
    @IsArray()
    @IsNotEmpty()
    committedWorkloads: WorkloadDto[];

    @ApiProperty({ example: new Date() })
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @IsDate()
    @ApiProperty({ example: new Date() })
    @IsNotEmpty()
    expiredDate: Date;
}

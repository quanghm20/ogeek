import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CommittedWorkloadByWeekDto {
    @ApiProperty()
    @IsString()
    startDate: string;

    @ApiProperty()
    @IsString()
    expiredDate: string;

    @ApiProperty()
    @IsNumber()
    workload: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CommittedWorkloadByWeekDto {
    @ApiProperty({ example: '01/01/2022' })
    @IsString()
    startDate: string;

    @ApiProperty({ example: '01/04/2022' })
    @IsString()
    expiredDate: string;

    @ApiProperty({ example: 12 })
    @IsNumber()
    workload: number;
}

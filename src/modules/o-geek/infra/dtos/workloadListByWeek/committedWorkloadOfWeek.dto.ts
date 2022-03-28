import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommittedWorkloadByWeekDto {
    @ApiProperty({ example: '01/01/2022' })
    @IsString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ example: '01/04/2022' })
    @IsString()
    @IsNotEmpty()
    expiredDate: string;

    @ApiProperty({ example: 12 })
    @IsNumber()
    @IsNotEmpty()
    workload: number;
}

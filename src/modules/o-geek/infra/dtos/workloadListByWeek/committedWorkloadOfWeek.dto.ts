import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommittedWorkloadByWeekDto {
    @ApiProperty({ example: '01/01/2022', default: '' })
    @IsString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ example: '01/04/2022', default: '' })
    @IsString()
    @IsNotEmpty()
    expiredDate: string;

    @ApiProperty({ example: 12, default: 0 })
    @IsNumber()
    @IsNotEmpty()
    workload: number;

    @ApiProperty({ example: '01/04/2022', default: '' })
    @IsDateString()
    @IsNotEmpty()
    createdAt: string;
}

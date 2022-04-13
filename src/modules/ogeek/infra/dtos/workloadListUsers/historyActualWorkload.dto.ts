import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class HistoryActualWorkloadDto {
    @ApiProperty({ example: -1 })
    @IsString()
    week: number;

    @ApiProperty({ example: 36 })
    @IsNumber()
    actualWorkload: number;
}

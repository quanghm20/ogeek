import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class InputValueStreamByWeekDto {
    @ApiProperty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNumber()
    week: number;
}

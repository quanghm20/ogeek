import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class WeekDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 12 })
    week: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 2022 })
    year: number;

    constructor(week: number, year: number) {
        this.week = week;
        this.year = year;
    }
}

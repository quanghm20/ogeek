import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetPotentialIssuesInputDto {
    userId?: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 3 })
    startWeek: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 2022 })
    startYear: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 3 })
    endWeek: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 2023 })
    endYear: number;

    constructor(
        startWeek: number,
        startYear: number,
        endWeek: number,
        endYear: number,
    ) {
        this.startWeek = startWeek;
        this.startYear = startYear;
        this.endWeek = endWeek;
        this.endYear = endYear;
    }
}

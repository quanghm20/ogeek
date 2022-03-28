import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class StartEndDateOfWeekWLInputDto {
    @ApiProperty({ example: new Date() })
    @IsDateString()
    startDateOfWeek: string;

    @ApiProperty({ example: new Date() })
    @IsDateString()
    endDateOfWeek: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    userId?: number;
}

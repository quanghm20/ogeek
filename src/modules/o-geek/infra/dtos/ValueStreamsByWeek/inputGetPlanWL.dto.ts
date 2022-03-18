import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class InputGetPlanWLDto {
    @ApiProperty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsDate()
    startDateOfWeek: Date;

    @ApiProperty()
    @IsDate()
    endDateOfWeek: Date;
}

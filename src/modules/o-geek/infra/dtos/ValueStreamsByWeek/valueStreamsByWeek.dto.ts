import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNumber } from 'class-validator';

import { WeekStatus } from '../../../../../common/constants/week-status';
import { ValueStreamByWeekDto } from './valueStream.dto';
export class ValueStreamsByWeekDto {
    @ApiProperty()
    @IsNumber()
    week: number;

    @ApiProperty()
    @IsDate()
    startDateOfWeek: Date;

    @ApiProperty()
    @IsDate()
    endDateOfWeek: Date;

    @ApiProperty()
    @IsEnum(WeekStatus)
    status: WeekStatus;

    @ApiProperty()
    @IsArray()
    valueStreamsByWeek: ValueStreamByWeekDto[];
}

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
    startDate: string;

    @ApiProperty()
    @IsDate()
    endDate: string;

    @ApiProperty()
    @IsEnum(WeekStatus)
    status: WeekStatus;

    @ApiProperty()
    @IsArray()
    valueStreams: ValueStreamByWeekDto[];
}

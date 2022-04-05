import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNumber } from 'class-validator';

import { WeekStatus } from '../../../../../common/constants/weekStatus';
import { ValueStreamByWeekDto } from './valueStream.dto';
export class ValueStreamsByWeekDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    week: number;

    @ApiProperty({ example: '28/02/2022' })
    @IsDate()
    startDate: string;

    @ApiProperty({ example: '04/03/2022' })
    @IsDate()
    endDate: string;

    @ApiProperty({ example: WeekStatus.PLANNING })
    @IsEnum(WeekStatus)
    status: WeekStatus;

    @ApiProperty()
    @IsArray()
    valueStreams: ValueStreamByWeekDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ValueStreamDto } from './valueStream.dto';

export class PlannedWorkloadHistoryDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ type: ValueStreamDto, isArray: true })
    valueStreams: ValueStreamDto[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: ['Early bird', 'Early bird', 'Early bird'] })
    notes: string[];

    constructor(notes: string[], valueStreams: ValueStreamDto[]) {
        this.notes = notes;
        this.valueStreams = { ...valueStreams };
    }
}

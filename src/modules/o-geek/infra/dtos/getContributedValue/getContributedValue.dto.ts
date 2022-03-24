import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { ExpertiseScopeShortDto } from './expertiseScopeShort.dto';
import { ValueStreamShortInsertDto } from './valueStreamShort.dto';
export class GetContributedValueShortDto {
    @ApiProperty({ type: ValueStreamShortInsertDto })
    valueStream: ValueStreamShortInsertDto;

    @IsArray()
    @ApiProperty({ type: ExpertiseScopeShortDto, isArray: true })
    expertiseScopes: ExpertiseScopeShortDto[];

    constructor(
        valueStream?: ValueStreamShortInsertDto,
        expertiseScope?: ExpertiseScopeShortDto[],
    ) {
        this.valueStream = valueStream;
        this.expertiseScopes = expertiseScope;
    }
}

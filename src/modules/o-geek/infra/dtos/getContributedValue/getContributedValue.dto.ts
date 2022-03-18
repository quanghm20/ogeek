import { ApiProperty } from '@nestjs/swagger';

import { ExpertiseScopeShortDto } from './expertiseScopeShort.dto';
import { ValueStreamShortDto } from './valueStreamShort.dto';
export class GetContributedValueShortDto {
    @ApiProperty({ type: ValueStreamShortDto })
    valueStream: ValueStreamShortDto;

    @ApiProperty({ type: ExpertiseScopeShortDto, isArray: true })
    expertiseScopes: ExpertiseScopeShortDto[];

    constructor(
        valueStream?: ValueStreamShortDto,
        expertiseScope?: ExpertiseScopeShortDto[],
    ) {
        this.valueStream = valueStream;
        this.expertiseScopes = expertiseScope;
    }
}

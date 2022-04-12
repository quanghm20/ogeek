import { ApiProperty } from '@nestjs/swagger';

import { ExpertiseScopeDto } from './expertiseScope.dto';
import { ValueStreamShortDto } from './valueStreamShort.dto';

export class ValueStreamsDto {
    @ApiProperty({ type: ValueStreamShortDto })
    valueStream: ValueStreamShortDto;

    @ApiProperty({ type: ExpertiseScopeDto, isArray: true })
    expertiseScopes: ExpertiseScopeDto[];

    constructor(
        valueStream: ValueStreamShortDto,
        expertiseScopes: ExpertiseScopeDto[],
    ) {
        this.valueStream = valueStream;
        this.expertiseScopes = expertiseScopes;
    }
}

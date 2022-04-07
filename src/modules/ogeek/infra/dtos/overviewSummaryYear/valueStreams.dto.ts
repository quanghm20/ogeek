import { ApiProperty } from '@nestjs/swagger';

import { ExpertiseScopesDto } from './expertiseScopes.dto';
import { ValueStreamShortDto } from './valueStreamShort.dto';

export class ValueStreamsDto {
    @ApiProperty({ type: ValueStreamShortDto })
    valueStream: ValueStreamShortDto;

    @ApiProperty({ type: ExpertiseScopesDto, isArray: true })
    expertiseScopes: ExpertiseScopesDto[];

    constructor(
        valueStream: ValueStreamShortDto,
        expertiseScopes: ExpertiseScopesDto[],
    ) {
        this.valueStream = valueStream;
        this.expertiseScopes = expertiseScopes;
    }
}

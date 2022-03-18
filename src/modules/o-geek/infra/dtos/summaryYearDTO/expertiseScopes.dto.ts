import { ApiProperty } from '@nestjs/swagger';

import { ExpertiseScopeShortDto } from './expertiseScopeShort.dto';

export class ExpertiseScopesDto {
    @ApiProperty({ type: ExpertiseScopeShortDto })
    expertiseScope: ExpertiseScopeShortDto;

    @ApiProperty({ example: '1000' })
    committedWorkload: number;

    @ApiProperty({ example: '1000' })
    plannedWorkload: number;

    @ApiProperty({ example: '92' })
    actualPlan: number;

    @ApiProperty({ example: '92' })
    workLog: number;

    constructor(
        expertiseScope?: ExpertiseScopeShortDto,
        committedWorkload?: number,
        plannedWorkload?: number,
        actualPlan?: number,
        workLog?: number,
    ) {
        this.expertiseScope = expertiseScope;
        this.committedWorkload = committedWorkload;
        this.plannedWorkload = plannedWorkload;
        this.actualPlan = actualPlan;
        this.workLog = workLog;
    }
}

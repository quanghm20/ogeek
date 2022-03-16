import { ApiProperty } from '@nestjs/swagger';

import { CommittedWorkloadDto } from './committedWorkload.dto';
import { PlannedWorkloadDto } from './plannedWorkload.dto';

export class OverviewSummaryYearDto {
    @ApiProperty()
    committedWorkloads: CommittedWorkloadDto;

    @ApiProperty({ type: () => PlannedWorkloadDto })
    plannedWorkloads: PlannedWorkloadDto;
}

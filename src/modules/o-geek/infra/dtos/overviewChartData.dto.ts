import { ApiProperty } from '@nestjs/swagger';

export class OverviewChartDataDto {
    @ApiProperty()
    expertiseScope?: string;

    @ApiProperty()
    committedWorkload?: number;

    @ApiProperty()
    plannedWorkload?: number;

    @ApiProperty()
    week?: number;
}

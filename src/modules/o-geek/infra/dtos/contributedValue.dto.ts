import { ApiProperty } from '@nestjs/swagger';

export class OverviewDataChart {
    @ApiProperty()
    expertiseScope: string;

    @ApiProperty()
    committedWorkload: number;

    @ApiProperty()
    plannedWorkload: number;

    @ApiProperty()
    worklog: number;

    /*@ApiProperty();
    week: number;*/
}
// export default OverviewDataChart;

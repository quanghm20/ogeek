import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { WorkloadOverviewDto } from '../OverviewChartDto/workloadOverview.dto';

export class OverviewChartDataDto {
    @ApiProperty({
        example: [
            {
                plannedWorkload: 18,
                actualWorkload: 19,
                week: 1,
            },
        ],
    })
    @IsArray()
    contributedValues: WorkloadOverviewDto[];

    @ApiProperty({ example: 'Product Backend' })
    @IsString()
    expertiseScope: string;
}

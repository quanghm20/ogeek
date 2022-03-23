import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { CommittedWorkloadDto } from '../committedWorkload.dto';
import { ExpertiseScopeDto } from '../expertiseScope.dto';

export class ExpertiseScopeWithinValueStreamDto {
    @ApiProperty({
        type: () => ExpertiseScopeDto,
        example: { id: 1, name: 'Product Backend' },
    })
    expertiseScope: ExpertiseScopeDto;

    @ApiProperty({
        example: {
            id: 1,
            committedWorkload: 20,
        },
    })
    committedWorkload: CommittedWorkloadDto;

    @ApiProperty({ example: 1 })
    contributedValueId: number;

    @ApiProperty({ example: '12' })
    @IsNumber()
    plannedWorkload: number;

    @ApiProperty({ example: '12' })
    @IsNumber()
    actualPlannedWorkload: number;

    @ApiProperty({ example: '10' })
    @IsString()
    worklog: number;
}

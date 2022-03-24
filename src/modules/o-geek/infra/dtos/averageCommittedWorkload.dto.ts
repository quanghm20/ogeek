import { ApiProperty } from '@nestjs/swagger';

export class AverageCommittedWorkloadDto {
    // @ApiProperty({ type: () => ContributedValueDto })
    // contributedValue: ContributedValueDto;

    @ApiProperty({ example: 40 })
    committedWorkload: number;

    @ApiProperty()
    expertiseScope: string;
}

import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { WorkloadDto } from './workload.dto';

export class CreateCommittedWorkloadDto {
    @ApiProperty({ type: () => UniqueEntityID, example: 134 })
    userId: UniqueEntityID;

    @ApiProperty({ example: 1 })
    contributedValueId: number;

    @ApiProperty({ type: () => WorkloadDto })
    committedWorkloads: WorkloadDto[];

    @ApiProperty({ example: new Date() })
    startDate: Date;

    @ApiProperty({ example: new Date() })
    expiredDate: Date;
}

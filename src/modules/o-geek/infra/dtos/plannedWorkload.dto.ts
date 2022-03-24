import { ApiProperty } from '@nestjs/swagger';

import { WorkloadStatus } from '../../../../common/constants/committed-status';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { CommittedWorkloadDto } from './committedWorkload.dto';
import { ContributedValueDto } from './contributedValue.dto';
import { UserDto } from './user.dto';

export class PlannedWorkloadDto {
    @ApiProperty({
        type: () => UniqueEntityID,
        example: new UniqueEntityID(1692),
    })
    id: UniqueEntityID;

    @ApiProperty({ type: () => UserDto })
    user?: UserDto;

    @ApiProperty({ type: () => ContributedValueDto })
    contributedValue: ContributedValueDto;

    @ApiProperty({ type: () => CommittedWorkloadDto })
    committedWorkload: CommittedWorkloadDto;

    @ApiProperty({ example: 40 })
    plannedWorkload: number;

    @ApiProperty({ example: new Date() })
    startDate: Date;

    @ApiProperty({ type: () => WorkloadStatus, example: WorkloadStatus.ACTIVE })
    status?: WorkloadStatus;

    @ApiProperty({ example: new Date() })
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;
}

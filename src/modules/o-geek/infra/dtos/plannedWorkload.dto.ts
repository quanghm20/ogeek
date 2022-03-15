import { ApiProperty } from '@nestjs/swagger';

import { WorkloadStatus } from '../../../../common/constants/committed-status';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { CommittedWorkloadDto } from './committedWorkload.dto';
import { ContributedValueDto } from './contributedValue.dto';
import { UserDto } from './user.dto';

export class PlannedWorkloadDto {
    @ApiProperty()
    id: UniqueEntityID;

    @ApiProperty()
    user: UserDto;

    @ApiProperty()
    contributedValue: ContributedValueDto;

    @ApiProperty()
    committedWorkload: CommittedWorkloadDto;

    @ApiProperty()
    plannedWorkload: number;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    status?: WorkloadStatus;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

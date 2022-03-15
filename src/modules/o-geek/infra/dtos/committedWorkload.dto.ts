import { ApiProperty } from '@nestjs/swagger';

import { WorkloadStatus } from '../../../../common/constants/committed-status';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { ContributedValueDto } from './contributedValue.dto';
import { UserDto } from './user.dto';

export class CommittedWorkloadDto {
    @ApiProperty()
    id: UniqueEntityID;

    @ApiProperty()
    user: UserDto;

    @ApiProperty()
    contributedValue: ContributedValueDto;

    @ApiProperty()
    committedWorkload: number;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    expiredDate: Date;

    @ApiProperty()
    status?: WorkloadStatus;

    @ApiProperty()
    picId?: UserDto;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

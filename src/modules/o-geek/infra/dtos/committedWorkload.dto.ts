import { ApiProperty } from '@nestjs/swagger';

import { WorkloadStatus } from '../../../../common/constants/committed-status';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { ContributedValueDto } from './contributedValue.dto';
import { UserDto } from './user.dto';

export class CommittedWorkloadDto {
    @ApiProperty({ type: UniqueEntityID, example: 134 })
    id: UniqueEntityID | number;

    @ApiProperty({ type: UserDto })
    user?: UserDto;

    @ApiProperty({ type: ContributedValueDto })
    contributedValue?: ContributedValueDto;

    @ApiProperty({ example: 40 })
    committedWorkload?: number;

    @ApiProperty({ example: new Date() })
    startDate?: Date;

    @ApiProperty({ example: new Date() })
    expiredDate?: Date;

    @ApiProperty({ enum: WorkloadStatus, example: WorkloadStatus.ACTIVE })
    status?: WorkloadStatus;

    @ApiProperty({ type: UserDto })
    pic?: UserDto;

    @ApiProperty({ example: new Date() })
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;
}

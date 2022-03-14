import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { User } from '../../domain/user';
import { ContributedValueDto } from './contributedValue.dto';
import { UserDto } from './user.dto';

export class CommittedWorkloadDto {
    @ApiProperty()
    id: UniqueEntityID | number;

    @ApiProperty()
    user: UserDto | User;

    @ApiProperty()
    contributedValue: ContributedValueDto;

    @ApiProperty()
    committedWorkload: number;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    expiredDate: Date;

    @ApiProperty()
    status?: boolean;

    @ApiProperty()
    picId?: UserDto;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

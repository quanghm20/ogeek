import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

import { IssueStatus } from '../../../../common/constants/issueStatus';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { UserDto } from './user.dto';
export class IssueDto {
    @ApiProperty({ type: UniqueEntityID, example: 122 })
    @IsNotEmpty()
    id: UniqueEntityID | number;

    @ApiProperty({ enum: IssueStatus, example: null })
    @IsOptional()
    status?: IssueStatus;

    @ApiProperty({ type: () => UserDto })
    @IsOptional()
    user?: UserDto;

    @ApiProperty()
    @IsDate()
    dateOfWeek: Date;

    @ApiProperty()
    @IsOptional()
    note?: string;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    updatedAt?: Date;
}

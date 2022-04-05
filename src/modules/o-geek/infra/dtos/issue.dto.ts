import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { IssueType } from '../../../../common/constants/issue-type';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { UserDto } from './user.dto';
export class IssueDto {
    @ApiProperty({ type: UniqueEntityID, example: 122 })
    @IsNotEmpty()
    id: UniqueEntityID | number;

    @ApiProperty({ enum: IssueType, example: null })
    @IsOptional()
    type?: IssueType;

    @ApiProperty({ type: () => UserDto })
    @IsOptional()
    user?: UserDto;

    @ApiProperty({ example: 12 })
    @IsOptional()
    week?: number;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    updatedAt?: Date;
}

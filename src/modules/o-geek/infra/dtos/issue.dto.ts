import { ApiProperty } from '@nestjs/swagger';

import { IssueType } from '../../../../common/constants/issue-type';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { IssueEntity } from '../database/entities/issue.entity';
import { UserDto } from './user.dto';
export class IssueDto {
    @ApiProperty({ type: UniqueEntityID, example: 122 })
    id: UniqueEntityID | number;

    @ApiProperty({ enum: IssueType, example: IssueType.NOT_ISSUE })
    type?: IssueType;

    @ApiProperty({ type: () => UserDto })
    user?: UserDto;

    @ApiProperty({ example: 12 })
    week?: number;

    @ApiProperty({ example: new Date() })
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;

    constructor(issue: IssueEntity) {
        this.id = new UniqueEntityID(issue.id);
        this.type = issue.type;
        this.user = issue.user;
        this.week = issue.week;
        this.createdAt = issue.createdAt;
        this.updatedAt = issue.updatedAt;
    }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';

export class UserWorkloadDto {
    @ApiProperty({ example: 'tuan.lq' })
    @IsString()
    alias: string;

    @ApiProperty({ type: UniqueEntityID, example: 1 })
    @IsNumber()
    id: number | UniqueEntityID;

    @ApiProperty({ example: 'https:link.com' })
    @IsString()
    avatar: string;
}

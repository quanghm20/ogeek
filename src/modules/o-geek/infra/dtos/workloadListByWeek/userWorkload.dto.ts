import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';

export class UserWorkloadDto {
    @ApiProperty()
    @IsString()
    alias: string;

    @ApiProperty()
    @IsNumber()
    id: number | UniqueEntityID;
}

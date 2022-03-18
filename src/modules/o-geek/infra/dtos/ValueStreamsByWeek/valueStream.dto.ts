import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { ContributedValueDto } from './contributedValue.dto';

export class ValueStreamByWeekDto {
    @ApiProperty({ type: UniqueEntityID })
    id: UniqueEntityID;

    @ApiProperty()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsArray()
    contributedValues?: ContributedValueDto[];
}

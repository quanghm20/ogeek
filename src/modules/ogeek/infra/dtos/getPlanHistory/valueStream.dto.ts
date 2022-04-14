import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ExpertiseScopeDto } from './expertiseScope.dto';

export class ValueStreamDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Delivery' })
    name: string;

    @IsArray()
    @ApiProperty({ type: ExpertiseScopeDto, isArray: true })
    expertiseScopes: ExpertiseScopeDto[];

    // constructor(id: number, name: string, expertiseScopes: ExpertiseScopeDto[]) {
    //   this.id = id;
    //   this.name = name;
    //   this.expertiseScopes = [...expertiseScopes];
    // }
}

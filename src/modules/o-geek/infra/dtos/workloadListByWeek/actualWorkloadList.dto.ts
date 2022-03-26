import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

import { ExpertiseScopeActualDto } from './expertiseScopeActual.dto';
import { UserWorkloadDto } from './userWorkload.dto';

export class ActualWorkloadListDto {
    @ApiProperty({ type: UserWorkloadDto })
    user: UserWorkloadDto;

    @ApiProperty({ type: ExpertiseScopeActualDto, isArray: true })
    @IsArray()
    expertiseScopes: ExpertiseScopeActualDto[];

    @ApiProperty({ example: 12 })
    @IsNumber()
    actualWorkload: number;
}

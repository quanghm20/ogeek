import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { ExpertiseScopeActualDto } from './expertiseScopeActual.dto';
import { UserWorkloadDto } from './userWorkload.dto';

export class ActualWorkloadListDto {
    @ApiProperty()
    user: UserWorkloadDto;

    @ApiProperty()
    expertiseScopes: ExpertiseScopeActualDto[];

    @ApiProperty()
    @IsNumber()
    actualWorkload: number;
}

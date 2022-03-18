import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

import { DomainId } from '../../../../../modules/o-geek/domain/domainId';

export class InputGetPlanWLDto {
    @ApiProperty()
    @IsNumber()
    userId: number | DomainId;

    @ApiProperty()
    @IsDate()
    startDateOfWeek: Date;

    @ApiProperty()
    @IsDate()
    endDateOfWeek: Date;
}

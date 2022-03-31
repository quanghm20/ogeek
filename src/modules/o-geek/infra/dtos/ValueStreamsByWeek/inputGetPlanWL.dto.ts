import { IsDate, IsNumber } from 'class-validator';

import { DomainId } from '../../../../../modules/o-geek/domain/domainId';

export class InputGetPlanWLDto {
    @IsNumber()
    userId: number | DomainId;

    @IsDate()
    startDateOfWeek: string;

    @IsDate()
    endDateOfWeek: string;
}

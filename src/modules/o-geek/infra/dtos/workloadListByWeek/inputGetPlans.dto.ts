import { IsDate } from 'class-validator';

export class InputGetPlansWLDto {
    @IsDate()
    startDateOfWeek: string;

    @IsDate()
    endDateOfWeek: string;
}

import { IsDate } from 'class-validator';

export class InputStartEndDateOfWeekWLDto {
    @IsDate()
    startDateOfWeek: string;

    @IsDate()
    endDateOfWeek: string;
}

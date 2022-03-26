import { IsDate } from 'class-validator';

export class StartEndDateOfWeekWLInputDto {
    @IsDate()
    startDateOfWeek: string;

    @IsDate()
    endDateOfWeek: string;
}

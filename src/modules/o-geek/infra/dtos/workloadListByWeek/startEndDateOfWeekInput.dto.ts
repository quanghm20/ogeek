import { IsDate, IsNotEmpty } from 'class-validator';

export class StartEndDateOfWeekWLInputDto {
    @IsDate()
    @IsNotEmpty()
    startDateOfWeek: string;

    @IsDate()
    @IsNotEmpty()
    endDateOfWeek: string;
}

import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class InputValueStreamByWeekDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    @Min(1)
    @Max(52)
    @IsPositive()
    week: number;
}

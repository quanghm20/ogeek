import { IsNumber } from 'class-validator';

export class InputValueStreamByWeekDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    week: number;
}

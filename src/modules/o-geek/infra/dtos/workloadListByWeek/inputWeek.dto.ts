import { IsNumber } from 'class-validator';

export class InputWeekDto {
    @IsNumber()
    week?: number;

    constructor(week: number) {
        this.week = week > 52 || week < 1 ? 1 : week;
    }
}

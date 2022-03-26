import { IsNumber } from 'class-validator';

export class InputListWorkloadDto {
    @IsNumber()
    week?: number;

    @IsNumber()
    userId: number;

    constructor(week: number, userId: number) {
        this.week = week;
        this.userId = userId;
    }
}

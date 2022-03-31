import { IsNotEmpty, IsNumber } from 'class-validator';

export class InputListWorkloadDto {
    @IsNumber()
    @IsNotEmpty()
    week?: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    constructor(week: number, userId: number) {
        this.week = week;
        this.userId = userId;
    }
}

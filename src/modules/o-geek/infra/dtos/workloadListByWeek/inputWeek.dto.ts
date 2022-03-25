export class InputWeekDto {
    week?: number;

    constructor(week: number) {
        this.week = week > 52 || week < 1 ? 1 : week;
    }
}

export class InputValueStreamByWeekDto {
    userId?: number;

    week?: number;

    constructor(userId: number, week: number) {
        this.userId = userId;
        this.week = week > 52 || week < 1 ? 1 : week;
    }
}

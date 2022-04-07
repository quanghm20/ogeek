import * as moment from 'moment';

export class MomentService {
    moment(): moment.Moment {
        // eslint-disable-next-line import/namespace
        moment.updateLocale('en', { week: { dow: 6 } });
        return this.moment();
    }

    public static getFirstDateOfWeek(injectedDate: Date): string {
        const num = moment(injectedDate).day();
        return moment(injectedDate)
            .utcOffset(420)
            .add(-num, 'days')
            .startOf('day')
            .format('MM-DD-YYYY');
    }

    public static getLastDateOfWeek(injectedDate: Date): string {
        return moment(injectedDate)
            .utcOffset(420)
            .add(6, 'days')
            .endOf('day')
            .format('MM-DD-YYYY');
    }

    public static shiftLastDateChart(injectedDate: Date): Date {
        const numOfWeekAfterCurrentWeekWhichContainsPlannedWorkload = 5;
        const numOfDaysInAWeek = 7;
        const result = new Date(
            moment(this.getLastDateOfWeek(injectedDate))
                .utcOffset(420)
                .add(
                    numOfDaysInAWeek *
                        numOfWeekAfterCurrentWeekWhichContainsPlannedWorkload,
                    'days',
                )
                .endOf('day')
                .format('MM-DD-YYYY'),
        );
        // eslint-disable-next-line @typescript-eslint/tslint/config
        return result;
    }

    public static firstDateOfWeek(week: number): Date {
        const date = moment().utcOffset(420).week(week).format();

        const num = moment(date).day();
        return moment(date)
            .utcOffset(420)
            .add(-num, 'days')
            .startOf('day')
            .toDate();
    }

    public static lastDateOfWeek(week: number): Date {
        const date = moment().utcOffset(420).week(week).format();

        const num = 7 - moment(date).day();
        return moment(date)
            .utcOffset(420)
            .add(num, 'days')
            .startOf('day')
            .toDate();
    }

    public static shiftFirstDateChart(injectedDate: Date): Date {
        const numOfWeekToContainWorklog = 12;
        const numOfDaysInAWeek = 7;

        return new Date(
            moment(this.getFirstDateOfWeek(injectedDate))
                .utcOffset('+07:00') // Change timezone to +7 UTC
                .subtract(numOfDaysInAWeek * numOfWeekToContainWorklog, 'days')
                .endOf('day')
                .format('MM-DD-YYYY'),
        );
    }

    public static shiftFirstWeekChart(injectedDate: Date): number {
        const createdWeek = moment(injectedDate).week();
        const currentWeek = moment().week();
        const subtract = currentWeek - createdWeek;
        const weekOne = 1;
        const numOfWeekToContainWorklog = 12;
        if (moment(injectedDate).year() < moment().year()) {
            if (currentWeek > 0 && currentWeek < numOfWeekToContainWorklog) {
                return weekOne;
            }
            return currentWeek - numOfWeekToContainWorklog + 1;
        }
        if (moment(injectedDate).year === moment().year) {
            if (currentWeek > 0 && currentWeek <= numOfWeekToContainWorklog) {
                return createdWeek;
            }
            if (currentWeek > numOfWeekToContainWorklog) {
                if (subtract > 0) {
                    return currentWeek - numOfWeekToContainWorklog + 1;
                }
                return createdWeek;
            }
        }
    }

    public static shiftLastWeekChart(startWeekChart: number): number {
        const weekAmountInChart = 17;
        const numOfWeekInYear = 52;
        if (startWeekChart + weekAmountInChart > numOfWeekInYear) {
            return numOfWeekInYear;
        }
        return startWeekChart + weekAmountInChart;
    }
}

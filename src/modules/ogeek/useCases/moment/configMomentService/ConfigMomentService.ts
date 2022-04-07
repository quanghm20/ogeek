import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';

@Injectable()
export class MomentService {
    @Inject('ICommittedWorkload')
    public static readonly COMMITTEDWORKLOAD: ICommittedWorkloadRepo;

    moment(): moment.Moment {
        // eslint-disable-next-line import/namespace
        moment.updateLocale('en', { week: { dow: 6 } });
        return this.moment();
    }
    public static convertDateToWeek(injectedDate: Date): number {
        return moment(injectedDate).week();
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
        return new Date(
            moment(this.getLastDateOfWeek(injectedDate))
                .utcOffset(420)
                .add(7 * 5, 'days')
                .endOf('day')
                .format('MM-DD-YYYY'),
        );
    }

    public static firstDateOfWeek(week: number): Date {
        const date = moment().week(week).format();

        const num = moment(date).format('e');

        const firstDateOfWeek = moment(date)
            .add(-num, 'days')
            .startOf('day')
            .format();

        return new Date(firstDateOfWeek);
    }

    public static lastDateOfWeek(week: number): Date {
        const date = moment().week(week).format();

        const num = moment(date).format('e');

        const endNum = 6 - Number(num);
        const endDateOfWeek = moment(date)
            .add(endNum, 'days')
            .endOf('day')
            .format();

        return new Date(endDateOfWeek);
    }

    public static shiftFirstDateChart(injectedDate: Date): Date {
        const result = new Date(
            moment(this.getFirstDateOfWeek(injectedDate))
                .utcOffset(420)
                .subtract(7 * 12, 'days')
                .endOf('day')
                .format('MM-DD-YYYY'),
        );
        // eslint-disable-next-line @typescript-eslint/tslint/config
        return result;
    }

    public static shiftFirstWeekChart(injectedDate: Date): number {
        const createdWeek = moment(injectedDate).week();
        const currentWeek = moment().week();
        const subtract = currentWeek - createdWeek;
        if (moment(injectedDate).year() < moment().year()) {
            if (currentWeek > 0 && currentWeek < 12) {
                return 1;
            }
            return currentWeek - 11;
        }
        if (moment(injectedDate).year === moment(injectedDate).year) {
            if (currentWeek > 0 && currentWeek <= 12) {
                return createdWeek;
            }
            if (currentWeek > 12) {
                if (subtract > 0) {
                    return currentWeek - 11;
                }
                return createdWeek;
            }
        }
    }

    public static shiftLastWeekChart(startWeekChart: number): number {
        if (startWeekChart + 17 > 52) {
            return 52;
        }
        return startWeekChart + 17;
    }
}

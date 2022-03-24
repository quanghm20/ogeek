import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class MomentService {
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
        const result = new Date(
            moment(this.getLastDateOfWeek(injectedDate))
                .utcOffset(420)
                .add(7 * 5, 'days')
                .endOf('day')
                .format('MM-DD-YYYY'),
        );
        // eslint-disable-next-line @typescript-eslint/tslint/config
        return result;
    }

    public static firstDateOfWeek(week: number): string {
        const date = moment().utcOffset(420).week(week).format();

        const num = moment(date).day();
        return moment(date)
            .utcOffset(420)
            .add(-num, 'days')
            .startOf('day')
            .format('MM-DD-YYYY');
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
}

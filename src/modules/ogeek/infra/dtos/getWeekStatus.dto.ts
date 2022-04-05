import { ApiProperty } from '@nestjs/swagger';

import { WeekStatus } from '../../../../common/constants/weekStatus';
import { UserEntity } from '../database/entities/user.entity';

export class GetWeekStatusDto {
    @ApiProperty({ enum: WeekStatus, example: WeekStatus.PLANNING })
    weekStatus?: WeekStatus;

    constructor(user: UserEntity) {
        this.weekStatus = user.weekStatus;
    }
}

import { ApiProperty } from '@nestjs/swagger';

import { WeekStatus } from '../../../../common/constants/week-status';
// import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { UserEntity } from '../database/entities/user.entity';

export class GetWeekStatusDto {
    // @ApiProperty({ type: UniqueEntityID, example: 26 })
    // id?: UniqueEntityID | number;

    @ApiProperty({ enum: WeekStatus, example: WeekStatus.PLANNING })
    weekStatus?: WeekStatus;

    constructor(user: UserEntity) {
        // this.id = new UniqueEntityID(user.id);
        this.weekStatus = user.weekStatus;
    }
}

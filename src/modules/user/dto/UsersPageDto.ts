import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { UserEntity } from '../user.entity';
import { UserDto } from './UserDto';

export class UsersPageDto {
    @ApiProperty({
        type: UserDto,
        isArray: true,
    })
    readonly data: UserDto[];

    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: UserEntity[], meta: PageMetaDto) {
        this.data = data.map((item) => item.toDto());
        this.meta = meta;
    }
}

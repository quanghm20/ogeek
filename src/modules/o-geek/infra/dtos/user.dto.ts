import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    alias: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    avatar?: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    weekStatus: string;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

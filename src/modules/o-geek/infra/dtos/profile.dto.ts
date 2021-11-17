import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    facebookLink: string;

    @ApiProperty()
    createdAt: Date;
}

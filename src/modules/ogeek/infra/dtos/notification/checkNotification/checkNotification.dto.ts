import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckNotificationDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    // @ApiProperty({ example: new Date() })
    // @MinDate(new Date())
    // updatedAt?: Date;
}

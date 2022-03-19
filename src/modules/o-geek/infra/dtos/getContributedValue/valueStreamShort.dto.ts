import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ValueStreamShortDto {
    @IsNumber()
    @ApiProperty({ example: 1 })
    id: number;

    @IsString()
    @ApiProperty({ example: 'Delivery' })
    name?: string;

    constructor(id?: number, name?: string) {
        this.id = id;
        this.name = name;
    }
}

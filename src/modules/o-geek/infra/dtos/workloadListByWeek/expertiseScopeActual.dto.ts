import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExpertiseScopeActualDto {
    @ApiProperty({ example: 'Product Backend' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 12 })
    @IsNumber()
    worklog: number;
}

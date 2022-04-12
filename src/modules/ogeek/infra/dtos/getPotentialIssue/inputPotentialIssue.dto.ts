import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class InputPotentialIssueDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 56 })
    userId: number;

    @IsDate()
    @ApiProperty()
    @IsNotEmpty()
    firstDateOfWeek: Date;
}

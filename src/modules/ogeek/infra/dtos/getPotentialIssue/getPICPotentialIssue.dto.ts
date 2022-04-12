import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class PICPotentialIssueDto {
    @ApiProperty()
    @IsString()
    picName: string;
}

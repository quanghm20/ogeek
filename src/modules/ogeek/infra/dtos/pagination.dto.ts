import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    sort?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    order?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { SortDefault } from '../../../../shared/services/pagination.service';

export class PaginationDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    sort?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    order?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    take?: number;
}

export class PaginationRepoDto {
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

    @ApiProperty()
    @IsOptional()
    order?: SortDefault;
}

export class PaginationResponseDto {
    @ApiProperty()
    @IsNumber()
    itemCount: number;

    @ApiProperty()
    @IsNumber()
    pageCount: number;

    @ApiProperty()
    @IsNumber()
    page: number;

    @ApiProperty()
    @IsNumber()
    take: number;

    constructor(page: number, take: number, itemCount: number) {
        this.page = page;
        this.take = take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(itemCount / this.take);
    }
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { CommittedWorkloadStatus } from '../../../../common/constants/committedStatus';
import { PageOptionsDto } from '../../../../common/dto/PageOptionsDto';

export class FilterCommittedWorkload extends PageOptionsDto {
    @ApiPropertyOptional()
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    userId?: number;

    @ApiPropertyOptional({
        enum: CommittedWorkloadStatus,
    })
    @IsEnum(CommittedWorkloadStatus)
    @IsOptional()
    status?: CommittedWorkloadStatus;
}

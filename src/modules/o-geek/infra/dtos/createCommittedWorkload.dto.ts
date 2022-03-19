import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber } from 'class-validator';

// import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { WorkloadDto } from './workload.dto';

export class CreateCommittedWorkloadDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    userId: number;

    @ApiProperty({ type: () => WorkloadDto, isArray: true })
    @IsArray()
    committedWorkloads: WorkloadDto[];

    @ApiProperty({ example: new Date() })
    @IsDateString()
    startDate: Date;

    @IsDateString()
    @ApiProperty({ example: new Date() })
    expiredDate: Date;
}

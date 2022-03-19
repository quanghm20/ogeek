import { ApiProperty } from '@nestjs/swagger';

// import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { WorkloadDto } from './workload.dto';

export class CreateCommittedWorkloadDto {
    @ApiProperty({ example: 1 })
    userId: number;

    @ApiProperty({ type: () => WorkloadDto, isArray: true })
    committedWorkloads: WorkloadDto[];

    @ApiProperty({ example: new Date() })
    startDate: Date;

    @ApiProperty({ example: new Date() })
    expiredDate: Date;
}

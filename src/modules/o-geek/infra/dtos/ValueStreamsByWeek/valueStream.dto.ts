import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { ContributedValueDto } from './contributedValue.dto';

export class ValueStreamByWeekDto {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    @ApiProperty({ type: UniqueEntityID, example: { _value: 1 } })
    id: UniqueEntityID;

    @ApiProperty({ example: 'delivery' })
    @IsString()
    name: string;

    @ApiProperty({
        example: [
            {
                expertiseScope: 'Product Backend',
                expertiseScopeId: 1,
                committedWorkload: 20,
                plannedWorkload: 12,
                actualPlannedWorkLoad: 12,
                worklog: 10,
            },
        ],
    })
    @IsArray()
    contributedValues: ContributedValueDto[];
}

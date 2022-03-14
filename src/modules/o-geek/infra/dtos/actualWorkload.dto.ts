import { ApiProperty } from '@nestjs/swagger';

export class ActualWorkloadDto {
    @ApiProperty()
    actualWorkload?: number;

    @ApiProperty()
    week?: number;
}

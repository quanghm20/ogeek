import { ApiProperty } from '@nestjs/swagger';

export class ExpertiseScopeDto {
    @ApiProperty()
    expertiseScope?: string;
}

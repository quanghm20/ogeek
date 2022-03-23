import { ApiProperty } from '@nestjs/swagger';

export class ExpertiseScopeShortDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Delivery' })
    name: string;

    constructor(id?: number, name?: string) {
        this.id = id;
        this.name = name;
    }
}

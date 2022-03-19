import { ApiProperty } from '@nestjs/swagger';
export class MessageDto {
    @ApiProperty({ example: "Can't create committed workloads." })
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

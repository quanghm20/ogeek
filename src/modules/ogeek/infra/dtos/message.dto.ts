import { ApiProperty } from '@nestjs/swagger';
export class MessageDto {
    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: "Can't create committed workloads." })
    message: string;

    constructor(statusCode: number, message: string) {
        this.statusCode = statusCode;
        this.message = message;
    }
}
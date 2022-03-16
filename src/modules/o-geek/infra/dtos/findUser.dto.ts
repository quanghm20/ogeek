import { IsString } from 'class-validator';

export class FindUserDto {
    @IsString()
    userID?: number = null;

    @IsString()
    alias?: string = null;
}

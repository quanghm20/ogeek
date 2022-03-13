import { IsString } from 'class-validator';

export class FindUserDto {
    @IsString()
    userID?: number = undefined;

    @IsString()
    alias?: string = undefined;
}

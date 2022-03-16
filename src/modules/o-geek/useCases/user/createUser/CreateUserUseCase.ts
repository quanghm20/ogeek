/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { User } from '../../../../../modules/o-geek/domain/user';
import { UserDto } from '../../../../../modules/o-geek/infra/dtos/user.dto';
import { UserRepository } from '../../../../../modules/o-geek/repos/userRepo';
import { FailToCreateUserErrors } from './CreateUserErrors';

type Response = Either<
    AppError.UnexpectedError | FailToCreateUserErrors.FailToCreateUser,
    Result<User>
>;

@Injectable()
export class CreateUserUseCase implements IUseCase<UserDto, Promise<Response>> {
    constructor(public readonly repo: UserRepository) {}

    async execute(userDto: UserDto): Promise<Response> {
        try {
            const user = await this.repo.createUser(userDto);
            //
            //
            //
            //
            if (!user) {
                return left(
                    new FailToCreateUserErrors.FailToCreateUser(),
                ) as Response;
            }

            return right(Result.ok(user));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

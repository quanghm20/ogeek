/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { User } from '../../../domain/user';
import { UserDto } from '../../../infra/dtos/user.dto';
import { UserRepository } from '../../../repos/userRepo';
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

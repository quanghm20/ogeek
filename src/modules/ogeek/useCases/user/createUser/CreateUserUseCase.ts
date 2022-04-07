import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

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
    constructor(@Inject('IUserRepo') public readonly repo: UserRepository) {}

    async execute(userDto: UserDto): Promise<Response> {
        try {
            // check user in Sente
            const url = `${process.env.MOCK_URL}/api/overview/user-info?alias=${userDto.alias}`;
            const request = await Axios.get<UserDto>(url, {
                headers: {
                    'x-api-key': process.env.MOCK_API_KEY,
                },
            });
            const response = request.data;
            if (!response) {
                return left(
                    new FailToCreateUserErrors.UserNotFound(
                        'User is not finded in Sente',
                    ),
                ) as Response;
            }

            const user = await this.repo.createUser(userDto);
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

/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { User } from '../../../domain/user';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { UserRepository } from '../../../repos/userRepo';
import { GetUserErrors } from './GetUserErrors';

type Response = Either<
    AppError.UnexpectedError | GetUserErrors.UserNotFound,
    Result<User>
>;

@Injectable()
export class GetUserUseCase
    implements IUseCase<FindUserDto, Promise<Response>> {
    constructor(public readonly repo: UserRepository) {}

    async execute(findUserDto: FindUserDto): Promise<Response> {
        try {
            let user = null;

            user = await this.repo.findById(findUserDto.userId);
            // if (findUserDto.alias) {
            //     user = await this.repo.findByAlias(findUserDto.alias);

            // }

            if (user) {
                return right(Result.ok(user));
            }

            return left(new GetUserErrors.UserNotFound()) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

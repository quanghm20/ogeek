/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { User } from '../../../domain/user';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { IUserRepo } from '../../../repos/userRepo';
import { GetUserErrors } from './GetUserErrors';

type Response = Either<
    AppError.UnexpectedError | GetUserErrors.UserNotFound,
    Result<User>
>;

@Injectable()
export class GetUserUseCase
    implements IUseCase<FindUserDto , Promise<Response> > {
    constructor(
        @Inject('IUserRepo') public readonly repo: IUserRepo,
    ) {}

    async helperExecute(findUserDto: FindUserDto): Promise<User> {
        if (findUserDto.alias) {
            return this.repo.findByAlias(findUserDto.alias);
        }

        if (findUserDto.userId) {
            return this.repo.findById(findUserDto.userId);
        }
        return null;
    }

    async execute(findUserDto: FindUserDto): Promise<Response> {
        try {
            const user = await this.helperExecute(findUserDto);
            if (user) {
                return right(Result.ok(user));
            }
            return left(new GetUserErrors.UserNotFound()) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

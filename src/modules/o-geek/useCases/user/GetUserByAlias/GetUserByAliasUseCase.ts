/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { User } from '../../../../../modules/o-geek/domain/user';
import { UserRepository } from '../../../../../modules/o-geek/repos/userRepo';
import { GetUserByAliasErrors } from './GetUserByAliasErrors';

type Response = Either<
    AppError.UnexpectedError | GetUserByAliasErrors.UserNotFound,
    Result<User>
>;

@Injectable()
export class GetUserByAliasUseCase
    implements IUseCase< string, Promise<Response> > {
    constructor(
        public readonly repo: UserRepository,
    ) {}

    async execute(alias: string): Promise<Response> {
        try {
            const user = await this.repo.findByAlias(alias);
            if (user) {
                return right(Result.ok(user));
            }

            return left(
                new GetUserByAliasErrors.UserNotFound(alias),
            ) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}


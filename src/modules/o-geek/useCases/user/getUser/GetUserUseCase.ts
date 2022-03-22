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

    async helperExecute(findUserDto: FindUserDto): Promise<Response> {
        if (findUserDto.alias) {
            return right(Result.ok(await this.repo.findByAlias(findUserDto.alias)));
        }

        if (findUserDto.userId) {
            return right(Result.ok(await this.repo.findById(findUserDto.userId)));
        }

        return left(new GetUserErrors.UserNotFound()) as Response;
    }

    async execute(findUserDto: FindUserDto): Promise<Response> {
        try {
            return await this.helperExecute(findUserDto);
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

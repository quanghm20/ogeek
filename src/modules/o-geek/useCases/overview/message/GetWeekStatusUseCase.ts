/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { DomainId } from '../../../domain/domainId';
import { User } from '../../../domain/user';
import { IUserRepo } from '../../../repos/userRepo';
import { GetWeekStatusErrors } from './GetWeekStatusErrors';

type Response = Either<
    AppError.UnexpectedError | GetWeekStatusErrors.GetWeekStatusFailed,
    Result<User>
>;

@Injectable()
export class GetWeekStatusUseCase
    implements IUseCase<DomainId | number, Promise<Response>> {
    constructor(@Inject('IUserRepo') public readonly userRepo: IUserRepo) {}

    async execute(userId: DomainId | number): Promise<Response> {
        try {
            const user = await this.userRepo.findById(userId);
            if (user) {
                return right(Result.ok(user));
            }
            return left(
                new GetWeekStatusErrors.GetWeekStatusFailed(userId),
            ) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}

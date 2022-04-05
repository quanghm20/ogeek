/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { WeekStatus } from '../../../../../common/constants/weekStatus';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { IUserRepo } from '../../../repos/userRepo';
import { StartWeekErrors } from './StartWeekErrors';

type Response = Either<
  AppError.UnexpectedError,
  Result<void>
>;

@Injectable()
export class StartWeekUseCase
  implements IUseCase<FindUserDto, Promise<Response>> {
  constructor(
    @Inject('IUserRepo') public readonly userRepo: IUserRepo,
  ) { }

  async execute(findUserDto: FindUserDto): Promise<Response> {
    const { userId } = findUserDto;

    try {
      const user = await this.userRepo.findById(userId);
      if (!user.isPlanned()) {
        return left(
          new StartWeekErrors.StartWeekFailed(),
        ) as Response;
      }

      await this.userRepo.update(
        { id: userId },
        { weekStatus: WeekStatus.EXECUTING },
      );
      return right(Result.ok());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

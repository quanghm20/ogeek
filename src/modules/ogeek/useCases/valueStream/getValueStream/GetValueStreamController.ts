import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Member } from '../../../../../core/domain/member';
import { MemberEmail } from '../../../../../core/domain/memberEmail';
import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { InputValueStreamByWeekDto } from '../../../infra/dtos/valueStreamsByWeek/inputValueStream.dto';
import { ValueStreamsByWeekDto } from '../../../infra/dtos/valueStreamsByWeek/valueStreamsByWeek.dto';
import { GetValueStreamError } from './GetValueStreamErrors';
import { GetValueStreamUseCase } from './GetValueStreamUseCase';

@Controller('api/value-stream')
@ApiTags('Value Stream card')
export class GetValueStreamController {
    constructor(public readonly useCase: GetValueStreamUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('')
    @ApiOkResponse({
        type: ValueStreamsByWeekDto,
        description: 'Get all value streams & expertise scopes in a week',
    })
    async execute(
        @Req() req: Request,
        @Query() { week }: InputValueStreamByWeekDto,
    ): Promise<ValueStreamsByWeekDto> {
        const { userId } = req.user as JwtPayload;
        const member = Member.create(
            {
                alias: '',
                email: MemberEmail.create().isSuccess
                    ? MemberEmail.create().getValue()
                    : MemberEmail.create().errorValue(),
            },
            new UniqueEntityID(userId),
        ).getValue();
        const result = await this.useCase.execute(week, member);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetValueStreamError.FailToGetValueStream:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get value stream by week',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something wrong happended',
                    );
            }
        }
        return result.value.getValue();
    }
}

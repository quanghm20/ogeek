import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import {
    InputListWorkloadDto,
    InputWeekDto,
} from '../../../infra/dtos/workloadListByWeek/inputListWorkload.dto';
import { WorkloadListByWeekDto } from '../../../infra/dtos/workloadListByWeek/workloadListByWeek.dto';
import { GetWorkloadListError } from './GetWorkloadListErrors';
import { GetWorkloadListUseCase } from './GetWorkloadListUseCase';

@Controller('api/admin/user/workloads')
@ApiTags('Workloads')
export class GetWorkloadListController {
    constructor(public readonly useCase: GetWorkloadListUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @Roles(RoleType.PP)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOkResponse({
        type: WorkloadListByWeekDto,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    async execute(
        @Req() req: Request,
        @Query() inputWeek: InputWeekDto,
    ): Promise<WorkloadListByWeekDto[]> {
        const { userId } = req.user as JwtPayload;

        const input = new InputListWorkloadDto(inputWeek.week, userId);
        const result = await this.useCase.execute(input);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetWorkloadListError.WorkloadListNotFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get workload list by week',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'server error!! ',
                    );
            }
        }
        return result.value.getValue();
    }
}

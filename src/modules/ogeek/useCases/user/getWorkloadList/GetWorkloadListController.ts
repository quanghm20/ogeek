import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../jwt-auth/jwt-auth-guard';
import { JwtPayload } from '../../../../jwt-auth/jwt-auth.strategy';
import { InputListWorkloadDto } from '../../../infra/dtos/workloadListByWeek/inputListWorkload.dto';
import { WorkloadListByWeekDto } from '../../../infra/dtos/workloadListByWeek/workloadListByWeek.dto';
import { GetWorkloadListError } from './GetWorkloadListErrors';
import { GetWorkloadListUseCase } from './GetWorkloadListUseCase';

@Controller('api/user/workloads')
@ApiTags('List workload table')
export class GetWorkloadListController {
    constructor(public readonly useCase: GetWorkloadListUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':week')
    @Roles(RoleType.ADMIN)
    @ApiOkResponse({
        type: WorkloadListByWeekDto,
        description: 'Get all workload list of geeks in a week',
    })
    async execute(
        @Req() req: Request,
        @Param('week') week: number,
    ): Promise<WorkloadListByWeekDto[]> {
        const { userId } = req.user as JwtPayload;
        const input = new InputListWorkloadDto(week, userId);
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

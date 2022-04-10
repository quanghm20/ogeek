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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { PaginationDto } from '../../../infra/dtos/pagination.dto';
import { HistoryWorkloadDto } from '../../../infra/dtos/workloadListUsers/historyWorkload.dto';
import { GetWorkloadListsError } from './GetWorkloadListsErrors';
import { GetWorkloadListsUseCase } from './GetWorkloadListsUseCase';

@Controller('api/admin/user/history-workloads')
@ApiTags('List workload table')
export class GetWorkloadListsController {
    constructor(public readonly useCase: GetWorkloadListsUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @Roles(RoleType.PP)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOkResponse({
        type: HistoryWorkloadDto,
        description: 'Get all workload list of geeks in a week',
    })
    async execute(
        @Req() req: Request,
        @Query() query: PaginationDto,
    ): Promise<HistoryWorkloadDto[]> {
        const { userId } = req.user as JwtPayload;
        const result = await this.useCase.execute(query, userId);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetWorkloadListsError.WorkloadListNotFound:
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

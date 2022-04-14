import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { RolesGuard } from '../../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { DetailCommittedWorkloadsByWeekDto } from '../../../../ogeek/infra/dtos/getDetailCommittedWorkloadByWeek/DetailCommittedWorkloads.dto';
import { InputValueStreamByWeekDto } from '../../../../ogeek/infra/dtos/valueStreamsByWeek/inputValueStream.dto';
import { GetDetailCommittedWorkloadByWeekErrors } from './GetDetailCommittedWorkloadByWeekErrors';
import { GetDetailCommittedWorkloadByWeekUseCase } from './GetDetailCommittedWorkloadsByWeekUseCase';

@Controller('api/admin/committed-workload/week')
@ApiTags('Committed Workload')
@ApiBearerAuth()
export class GetDetailCommittedWorkloadByWeekController {
    constructor(
        public readonly useCase: GetDetailCommittedWorkloadByWeekUseCase,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DetailCommittedWorkloadsByWeekDto,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Interal Server Error',
    })
    @Roles(RoleType.PP)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async execute(
        @Query() { week }: InputValueStreamByWeekDto,
        @Query('userId') userId: number,
    ): Promise<DetailCommittedWorkloadsByWeekDto> {
        const result = await this.useCase.execute(week, userId);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetDetailCommittedWorkloadByWeekErrors.NotFoundCommittedWorkload:
                    throw new NotFoundException(error.errorValue());
                case GetDetailCommittedWorkloadByWeekErrors.NotFoundActualWorklogs:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }

        return result.value.getValue();
    }
}

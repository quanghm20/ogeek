import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    // UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

// import { JwtAuthGuard } from '../../../../../modules/jwt-auth/jwt-auth-guard';
import { InputWeekDto } from '../../../infra/dtos/workloadListByWeek/inputWeek.dto';
import { WorkloadListByWeekDto } from '../../../infra/dtos/workloadListByWeek/workloadListByWeek.dto';
import { GetWorkloadListError } from './GetWorkloadListErrors';
import { GetWorkloadListUseCase } from './GetWorkloadListUseCase';

@Controller('api/user/workloads')
@ApiTags('List workload table')
export class GetWorkloadListController {
    constructor(public readonly useCase: GetWorkloadListUseCase) {}

    // @UseGuards(JwtAuthGuard)
    @Get(':week')
    @ApiOkResponse({
        type: WorkloadListByWeekDto,
        description: 'Get all workload list of geeks in a week',
    })
    async execute(
        @Param('week') week: number,
    ): Promise<WorkloadListByWeekDto[]> {
        const input = new InputWeekDto(week);
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

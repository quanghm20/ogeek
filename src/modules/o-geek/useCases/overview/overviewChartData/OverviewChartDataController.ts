// import {
//     Controller,
//     Get,
//     HttpCode,
//     HttpStatus,
//     InternalServerErrorException,
//     NotFoundException,
//     Param,
//     Req,
// } from '@nestjs/common';
// import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
// import moment from 'moment';

// import { JwtPayload } from '../../../../jwt-auth/jwt-auth.strategy';
// import { ActualWorkloadDto } from '../../../infra/dtos/OverviewChartDto/actualWorkload.dto';
// import { OverviewChartDataDto } from '../../../infra/dtos/OverviewChartDto/overviewChartData.dto';
// import { OverviewChartDataMap } from '../../../mappers/overviewChartDataMap';
// import { GetOverviewChartDataErrors } from './OverviewChartDataErrors';
// import { GetOverviewChartDataUseCase } from './OverviewChartDataUseCase';

// @Controller('overview-chart')
// @ApiTags('Overview Chart')
// export class OverviewChartDataController {
//     constructor(public readonly useCase: GetOverviewChartDataUseCase) {}
//     @Get('id')
//     @HttpCode(HttpStatus.OK)
//     @ApiOkResponse({
//         type: OverviewChartDataDto,
//         description: 'Data for overview chart',
//     })
//     @ApiBadRequestResponse({
//         type: OverviewChartDataDto,
//         description: 'No data to retrieve',
//     })
//     async execute(
//         @Req() req: Request,
//         @Param('currentDate') currentDate: Date,
//     ): Promise<OverviewChartDataDto[]> {
//         const currentWeek = moment(currentDate).week();
//         const { userId } = req.user as JwtPayload;
//         const result = await this.useCase.execute(userId, currentWeek);
//         if (result.isLeft()) {
//             const error = result.value;

//             switch (error.constructor) {
//                 case GetOverviewChartDataErrors.GetOverviewChartDataFailed:
//                     throw new NotFoundException(
//                         error.errorValue(),
//                         'Can not get data for overview chart by ID',
//                     );
//                 default:
//                     throw new InternalServerErrorException(
//                         error.errorValue(),
//                         'Cannot get data for overview chart',
//                     );
//             }
//         }
//         return result.value.getValue();
//     }
// }

// import {
//     Controller,
//     Get,
//     HttpCode,
//     HttpStatus,
//     InternalServerErrorException,
//     NotFoundException,
//     Param,
// } from '@nestjs/common';
// import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

// import { CommittedWorkloadDto } from '../../../infra/dtos/committedWorkload.dto';
// import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
// import { GetAverageCommittedWorkloadErrors } from './GetAverageCommittedWorkloadErrors';
// import { GetAverageCommittedWorkloadUseCase } from './GetAverageCommittedWorkloadUseCase';

// @Controller('average-committed-workload')
// @ApiTags('Average Committed Workload')
// export class GetAverageCommittedWorkload {
//     constructor(public readonly useCase: GetAverageCommittedWorkloadUseCase) {}

//     @Get('id')
//     @HttpCode(HttpStatus.OK)
//     @ApiOkResponse({
//         type: CommittedWorkloadDto,
//         description: 'Average committed workload of Geek',
//     })
//     async execute(@Param('id') userId: number): Promise<CommittedWorkloadDto> {
//         const result = await this.useCase.execute(userId);
//         if (result.isLeft()) {
//             const error = result.value;

//             switch (error.constructor) {
//                 case GetAverageCommittedWorkloadErrors.NoWorkloadCommitted:
//                     throw new NotFoundException(
//                         error.errorValue(),
//                         'Cannot get average committed workload',
//                     );
//                 case GetAverageCommittedWorkloadErrors.NoUserFound:
//                     throw new NotFoundException(
//                         error.errorValue(),
//                         'Cannot find user to get average committed workload',
//                     );
//                 default:
//                     throw new InternalServerErrorException(
//                         error.errorValue(),
//                         'Cannot get average committed workload',
//                     );
//             }
//         }
//         return CommittedWorkloadMap.fromDomain(result.value.getValue());
//     }
// }

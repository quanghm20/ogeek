// import {
//     Controller,
//     Get,
//     HttpCode,
//     HttpStatus,
//     InternalServerErrorException,
//     NotFoundException,
//     Param,
//     Query,
//     Req,
// } from '@nestjs/common';
// import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

// // import { ProfileDto } from '../../../infra/dtos/profile.dto';
// import { GetContributedValueErrors } from './getContributedValueErrors';
// import { GetContributedValueUseCase } from './getContributedValueUseCase';

// @Controller('api/contributed-value')
// @ApiTags('Contributed Value')
// export class GetContributedValueController {
//     constructor(public readonly useCase: GetContributedValueUseCase) {}

//     @Get()
//     @HttpCode(HttpStatus.OK)
//     @ApiOkResponse({
//         description: 'social profile of Geek',
//     })
//     async execute(
//         @Query('date') date: string,
//         @Req() request: Request,
//     ): Promise<any> {
//         const result = await this.useCase.execute(date, request);
//         if (result.isLeft()) {
//             const error = result.value;

//             switch (error.constructor) {
//                 case '':
//                     throw new NotFoundException(
//                         error.errorValue(),
//                         'Can not get profile by id',
//                     );
//                 default:
//                     throw new InternalServerErrorException(
//                         error.errorValue(),
//                         'Can not search profile',
//                     );
//             }
//         }

//         return ContributedValueMap.fromDomain(result.value.getValue());
//     }
// }

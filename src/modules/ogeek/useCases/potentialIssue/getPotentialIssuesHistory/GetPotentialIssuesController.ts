import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { RolesGuard } from '../../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { CreatePlannedWorkloadsListDto } from '../../../infra/dtos/createPlannedWorkload/createPlannedWorkloadsList.dto';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { GetPotentialIssuesInputDto } from '../../../infra/dtos/getPotentialIssues/getPotentialIssuesInput.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { GetPotentialIssuesErrors } from './GetPotentialIssuesErrors';
import { GetPotentialIssuesUseCase } from './GetPotentialIssuesUseCase';

@Controller('api/admin/user/:userId/potential-issue')
@ApiTags('Potential Issue')
export class GetPotentialIssuesController {
    constructor(public readonly useCase: GetPotentialIssuesUseCase) {}

    @Roles(RoleType.PP)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Post('history')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: [CreatePlannedWorkloadsListDto],
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiNotFoundResponse({
        description: 'Not Found',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Interal Server Error',
    })
    async execute(
        @Req() req: Request,
        @Param('userId') userId: number,
        @Body() getPotentialIssuesInputDto: GetPotentialIssuesInputDto,
    ): Promise<MessageDto> {
        const jwtPayload = req.user as JwtPayload;
        const findUserDto = { ...jwtPayload } as FindUserDto;
        const picId = findUserDto.userId;

        getPotentialIssuesInputDto.userId = userId;
        const result = await this.useCase.execute(
            getPotentialIssuesInputDto,
            picId,
        );

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetPotentialIssuesErrors.UserNotFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'User cannot be found',
                    );
                case GetPotentialIssuesErrors.GetPotentialIssuesFailed:
                    throw new BadRequestException(
                        error.errorValue(),
                        'Failed to get potential issues',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something went wrong',
                    );
            }
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'Get potential issues sucessfully',
            // data: getPotentialIssuesInputDto,
        } as MessageDto;
    }
}

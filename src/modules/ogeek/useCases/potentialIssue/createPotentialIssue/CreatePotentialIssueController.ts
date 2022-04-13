import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { CreatePotentialIssueDto } from '../../../infra/dtos/createPotentialIssue/createPotentialIssue.dto';
import { CreatePotentialIssueErrors } from './CreatePotentialIssueErrors';
import { CreatePotentialIssueUseCase } from './CreatePotentialIssueUseCase';

@Controller('api/admin/user/potential-issue')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CreatePotentialIssueController {
    constructor(public readonly useCase: CreatePotentialIssueUseCase) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleType.PP)
    @ApiCreatedResponse({
        type: CreatePotentialIssueDto,
        description: 'Created',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Interal Server Error',
    })
    async execute(
        @Body() createPotentialIssue: CreatePotentialIssueDto,
        @Req() req: Request,
    ): Promise<CreatePotentialIssueDto> {
        const { userId: picId } = req.user as JwtPayload;
        const result = await this.useCase.execute(createPotentialIssue, picId);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreatePotentialIssueErrors.FailToCreatePotentialIssue:
                    throw new BadRequestException(error.errorValue());
                case CreatePotentialIssueErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                case CreatePotentialIssueErrors.Forbidden:
                    throw new ForbiddenException(error.errorValue());
                case CreatePotentialIssueErrors.BadRequest:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return result.value.getValue();
    }
}

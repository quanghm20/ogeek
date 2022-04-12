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
import { CreateIssueDto } from '../../../infra/dtos/createIssue/createIssue.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { CreateIssueErrors } from './CreateIssueErrors';
import { CreateIssueUseCase } from './CreateIssueUseCase';

@Controller('api/admin/user/potential-issue')
@ApiTags('Potential Issue')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CreateIssueController {
    constructor(public readonly useCase: CreateIssueUseCase) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleType.PP)
    @ApiCreatedResponse({
        type: MessageDto,
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
        @Body() body: CreateIssueDto,
        @Req() req: Request,
    ): Promise<MessageDto> {
        const { userId: picId } = req.user as JwtPayload;
        const createIssueDto = { ...body, picId };
        const result = await this.useCase.execute(createIssueDto);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreateIssueErrors.CreateIssueFailed:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Failed to create issue',
                    );
                case CreateIssueErrors.Forbidden:
                    throw new ForbiddenException(error.errorValue());
                case CreateIssueErrors.NotFound:
                    throw new NotFoundException(error.errorValue());
                case CreateIssueErrors.WeekError:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Update successfully',
        } as MessageDto;
    }
}

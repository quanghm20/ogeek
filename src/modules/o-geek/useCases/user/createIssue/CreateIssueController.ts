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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/role-type';
import { Roles } from '../../../../../decorators/roles.decorator';
import { CreateIssueDto } from '../../../..//o-geek/infra/dtos/createIssue/createIssue.dto';
import { JwtAuthGuard } from '../../../../jwt-auth/jwt-auth-guard';
import { JwtPayload } from '../../../../jwt-auth/jwt-auth.strategy';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { CreateIssueUseCase } from '../../../useCases/user/createIssue/CreateIssueUseCase';
import { CreateIssueErrors } from './CreateIssueErrors';

@Controller('api/user/workloads/issue')
@ApiTags('API create issue')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CreateIssueController {
    constructor(public readonly useCase: CreateIssueUseCase) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleType.ADMIN)
    @ApiOkResponse({
        type: MessageDto,
        description: 'Create issue',
    })
    // @UsePipes(new ValidationPipe({ transform: true }))
    async execute(
        @Body() body: CreateIssueDto,
        @Req() req: Request,
    ): Promise<MessageDto> {
        const { userId: picId } = req.user as JwtPayload;
        body.picId = picId;
        const result = await this.useCase.execute(body);
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

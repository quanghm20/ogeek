import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiProperty,
    ApiPropertyOptional,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { Roles } from '../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { CreateCommittedWorkloadDto } from '../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { CreateCommittedWorkloadErrors } from './createCommittedWorkload/CreateCommittedWorkloadErrors';
import { CreateCommittedWorkloadUseCase } from './createCommittedWorkload/CreateCommittedWorkloadUseCase';
import { GetCommittedWorkloadErrors } from './getCommittedWorkload/GetCommittedWorkloadErrors';
import { GetCommittedWorkloadUseCase } from './getCommittedWorkload/GetCommittedWorkloadsUseCase';
import { GetHistoryCommittedWorkloadUseCase } from './getHistoryCommittedWorkload/GetCommittedWorkloadsUseCase';

export class DataCommittedWorkload {
    @ApiProperty({
        type: CommittedWorkloadShortDto,
        isArray: true,
    })
    data: CommittedWorkloadShortDto[];
    constructor(data: CommittedWorkloadShortDto[]) {
        this.data = data;
    }
}
export class FilterCommittedWorkload {
    @ApiProperty()
    @ApiPropertyOptional()
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    userId?: number;
}

@Controller('api/committed-workloads')
@ApiTags('Committed Workload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CommittedWorkloadController {
    constructor(
        public readonly createCommitUseCase: CreateCommittedWorkloadUseCase,
        public readonly getCommitUseCase: GetCommittedWorkloadUseCase,
        public readonly getHistoryCommitUseCase: GetHistoryCommittedWorkloadUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleType.PP)
    @ApiCreatedResponse({
        type: DataCommittedWorkload,
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
    @UsePipes(new ValidationPipe({ transform: true }))
    async execute(
        @Body() body: CreateCommittedWorkloadDto,
        @Req() req: Request,
    ): Promise<DataCommittedWorkload> {
        const createBy = req.user as JwtPayload;
        const result = await this.createCommitUseCase.execute(
            body,
            createBy.userId,
        );
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreateCommittedWorkloadErrors.Forbidden:
                    throw new ForbiddenException(error.errorValue());
                case CreateCommittedWorkloadErrors.NotFound:
                    throw new NotFoundException(error.errorValue());
                case CreateCommittedWorkloadErrors.DateError:
                    throw new BadRequestException(error.errorValue());
                case CreateCommittedWorkloadErrors.ExistCommittedWorkloadInComing:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return new DataCommittedWorkload(result.value.getValue());
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleType.PP)
    @ApiOkResponse({
        type: DataCommittedWorkload,
        description: 'OK',
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
        description: 'Internal Server Error',
    })
    @UsePipes(
        new ValidationPipe({
            transform: true,
        }),
    )
    async getAllCommittedWorkload(
        @Query() query: FilterCommittedWorkload,
    ): Promise<DataCommittedWorkload> {
        const result = await this.getCommitUseCase.execute(query);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetCommittedWorkloadErrors.NotFound:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return new DataCommittedWorkload(result.value.getValue());
    }
}

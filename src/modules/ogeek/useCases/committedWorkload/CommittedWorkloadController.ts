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
    ApiBearerAuth,
    ApiOkResponse,
    ApiProperty,
    ApiPropertyOptional,
    ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { Roles } from '../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { CreateCommittedWorkloadDto } from '../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { MessageDto } from '../../infra/dtos/message.dto';
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
    userId?: number;
    constructor(userId?: number) {
        this.userId = userId;
    }
}

@Controller('api/committed-workloads')
@ApiTags('API committed workload ')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CommittedWorkloadController {
    constructor(
        public readonly createCommitUseCase: CreateCommittedWorkloadUseCase,
        public readonly getCommitUseCase: GetCommittedWorkloadUseCase,
        public readonly getHistoryCommitUseCase: GetHistoryCommittedWorkloadUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleType.PP)
    @ApiOkResponse({
        type: DataCommittedWorkload,
        description: 'Created committed workload',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async execute(
        @Body() body: CreateCommittedWorkloadDto,
        @Req() req: Request,
    ): Promise<MessageDto> {
        const createdBy = req.user as JwtPayload;
        const result = await this.createCommitUseCase.execute(
            body,
            createdBy.userId,
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
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return new MessageDto(
            HttpStatus.CREATED,
            'Created committed workload successfully !',
        );
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleType.PP)
    @ApiOkResponse({
        type: DataCommittedWorkload,
        description: 'Get all committed workload',
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

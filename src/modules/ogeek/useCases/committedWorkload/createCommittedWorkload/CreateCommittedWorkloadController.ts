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
    Param,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiProperty,
    ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../jwt-auth/jwt-auth-guard';
import { JwtPayload } from '../../../../jwt-auth/jwt-auth.strategy';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { GetCommittedWorkloadErrors } from '../getCommittedWorkload/GetCommittedWorkloadErrors';
import { GetCommittedWorkloadUseCase } from '../getCommittedWorkload/GetCommittedWorkloadsUseCase';
import { GetHistoryCommittedWorkloadUseCase } from '../getHistoryCommittedWorkload/GetCommittedWorkloadsUseCase';
import { CreateCommittedWorkloadErrors } from './CreateCommittedWorkloadErrors';
import { CreateCommittedWorkloadUseCase } from './CreateCommittedWorkloadUseCase';

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

@Controller('api/committed-workloads')
@ApiTags('API committed workload ')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CreateCommittedWorkloadController {
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
        const pic = req.user as JwtPayload;
        const picId = pic.userId;
        body.picId = picId;
        const result = await this.createCommitUseCase.execute(body);
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
    @UseGuards()
    @ApiOkResponse({
        type: DataCommittedWorkload,
        description: 'Get all committed workload',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllCommittedWorkload(): Promise<DataCommittedWorkload> {
        const result = await this.getCommitUseCase.execute();
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

    @Get('/:userId')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DataCommittedWorkload,
        description: 'Get committed workload by user ',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getHistoryCommittedWorkload(
        @Param('userId') userId: number,
    ): Promise<DataCommittedWorkload> {
        const result = await this.getHistoryCommitUseCase.execute(userId);
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

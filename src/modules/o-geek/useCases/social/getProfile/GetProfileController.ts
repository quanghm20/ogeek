import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProfileDto } from '../../../infra/dtos/profile.dto';
import { ProfileMap } from '../../../mappers/profileMap';
import { GetProfileErrors } from './GetProfileErrors';
import { GetProfileUseCase } from './GetProfileUseCase';

@Controller('social-profile')
@ApiTags('Social Profile')
export class GetProfileController {
    constructor(public readonly useCase: GetProfileUseCase) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: ProfileDto,
        description: 'social profile of Geek',
    })
    async execute(@Param('id') profileId: string): Promise<ProfileDto> {
        const result = await this.useCase.execute(profileId);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetProfileErrors.ProfileNotFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get profile by id',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Can not search profile',
                    );
            }
        }

        return ProfileMap.toDTO(result.value.getValue());
    }
}

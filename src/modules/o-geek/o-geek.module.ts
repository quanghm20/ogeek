// import { HttpModule, Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { ProfileEntity } from './infra/database/entities/profile.entity';
// import { ProfileRepository } from './repos/index';
// import {
//     GetProfileController,
//     GetProfileUseCase,
// } from './useCases/social/getProfile';

// @Module({
//     imports: [HttpModule, TypeOrmModule.forFeature([ProfileEntity])],
//     controllers: [GetProfileController],
//     providers: [
//         GetProfileUseCase,
//         {
//             provide: 'IProfileRepo',
//             // useClass: ProfileRepository,
//         },
//     ],
// })
export class OGeekModule {}

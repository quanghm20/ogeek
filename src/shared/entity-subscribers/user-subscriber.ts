// import { UserEntity } from 'modules/o-geek/infra/database/entities/user.entity';
// import {
//     EntitySubscriberInterface,
//     EventSubscriber,
//     InsertEvent,
//     UpdateEvent,
// } from 'typeorm';

// import { UtilsService } from '../../providers/utils.service';

// @EventSubscriber()
// export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
//     listenTo(): any {
//         return UserEntity;
//     }
//     beforeInsert(event: InsertEvent<UserEntity>): any {
//         if (event.entity.password) {
//             event.entity.password = UtilsService.generateHash(
//                 event.entity.password,
//             );
//         }
//     }
//     beforeUpdate(event: UpdateEvent<UserEntity>): any {
//         if (event.entity.password !== event.databaseEntity.password) {
//             event.entity.password = UtilsService.generateHash(
//                 event.entity.password,
//             );
//         }
//     }
// }

// import { Module } from '@nestjs/common';
// import { CommonModule } from 'src/Models/V1/Common/common.module';
// import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
// import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
// import { MailModule } from 'src/Providers/Mail/mail.module';
// import { PushAppModule } from 'src/Providers/PushApp/pushApp.module';
// import { SmsModule } from 'src/Providers/Sms/sms.module';
// import { ConvertExcel } from 'src/Utils/DataFrame/excel';
// // import { MemberPurchaseAnalysis } from 'src/Utils/DataFrame/member.purchase.analysis';
// import { ConvertZip } from 'src/Utils/DataFrame/zip';
// import { BadgeRepository } from '../Badge/badge.repository';
// import { CommonService } from '../Common/common.service';
// import { MemberModule } from '../Member/member.module';
// import { MemberShipModule } from '../MemberShip/memberShip.module';
// import { NotifyRepository } from '../Notify/notify.repository';
// import { PermissionRepository } from '../Permission/permission.repository';
// import { TagRepository } from '../Tag/tag.repository';
// import { MotController } from './mot.controller';
// import { MotRepository } from './mot.repository';
// import { MotService } from './mot.service';

// @Module({
//   imports: [
//     MysqlModule,
//     CommonModule,
//     RedisModule,
//     MemberShipModule,
//     SmsModule,
//     MailModule,
//     MemberModule,
//     PushAppModule
//   ],
//   controllers: [MotController],
//   providers: [
//     MotService,
//     MotRepository,
//     CommonService,
//     NotifyRepository,
//     ConvertExcel,
//     // MemberPurchaseAnalysis,
//     ConvertZip,
//     TagRepository,
//     PermissionRepository,
//     BadgeRepository
//   ],
//   exports: [MotService, MotRepository]
// })
// export class MotModule {}

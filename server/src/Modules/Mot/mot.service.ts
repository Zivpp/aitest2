// import { HttpStatus, Injectable } from '@nestjs/common';
// import config from 'src/Config/config';
// import configError from 'src/Config/error.message.config';
// import { MetaDataCommon } from 'src/Definition/Dto';
// import { CLUSTER_LIST_TYPE } from 'src/Definition/Enum/Cluster/cluster.list.type.enum';
// import {
//   CLUSTER_EXPORT_STATUS_TYPE,
//   CLUSTER_EXPORT_STATUS_TYPE_STR,
//   CLUSTER_SETTING_TYPE
// } from 'src/Definition/Enum/Cluster/cluster.setting.type.enum';
// import { ENUM_MEMBER_SHIP_SETTING_STATUS_CODE } from 'src/Definition/Enum/MemberShip/member.ship.setting.status.enum';
// import { ENUM_CLUSTER_STATUS } from 'src/Definition/Enum/Mot/cluster.status.enum';
// import { ENUM_EVENT } from 'src/Definition/Enum/Mot/event.enum';
// import { ENUM_LOG_SEND_METHOD_STR } from 'src/Definition/Enum/Mot/log.send.method.enum';
// import { ENUM_MOT_STATUS } from 'src/Definition/Enum/Mot/mot.status.enum';
// import { ENUM_MOT_TYPE } from 'src/Definition/Enum/Mot/mot.type.enum';
// import { REPLACE_STRING } from 'src/Definition/Enum/Mot/replace.string.enum';
// import { ENUM_SEND_TARGET } from 'src/Definition/Enum/Mot/send.target.enum';
// import {
//   ENUM_SETTING_SEND_METHOD,
//   ENUM_SETTING_SEND_METHOD_STR
// } from 'src/Definition/Enum/Mot/setting.send.method.enum';
// import { ENUM_BELONG_TO } from 'src/Definition/Enum/belong.to.enum';
// import { BELONG_TO } from 'src/Definition/Enum/code.center.belong.enum';
// import { ENUM_INSERT_EXPORT_EVENT } from 'src/Definition/Enum/insert.export.event.enum';
// import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
// import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
// import { RedisService } from 'src/Providers/Database/Redis/redis.service';
// import { MailProvider } from 'src/Providers/Mail/mail.provider';
// import { PushAppProvider } from 'src/Providers/PushApp/pushApp.provider';
// import { SmsProvider } from 'src/Providers/Sms/sms.provider';
// // import { MemberPurchaseAnalysis } from 'src/Utils/DataFrame/member.purchase.analysis';
// // import { generatePassword, getLogTableNameByMonth } from 'src/Utils/tools';
// import { generatePassword } from 'src/Utils/tools';
// import { CommonRepository } from '../Common/common.repository';
// import { CommonService } from '../Common/common.service';
// import { MemberRepository } from '../Member/member.repository';
// import { MemberService } from '../Member/member.service';
// // import { GetMemberSettingParameterDto } from '../MemberShip/Dto/get.member.setting.parameter.dto';
// import { MemberShip } from '../MemberShip/Interface/get.member.ship.setting.info.interface';
// // import { MemberShipRepository } from '../MemberShip/memberShip.repository';
// import { MemberShipService } from '../MemberShip/memberShip.service';
// import { NotifyRepository } from '../Notify/notify.repository';
// import { PermissionRepository } from '../Permission/permission.repository';
// import { ExportSendLogDto } from './Dto/export.send.log.dto';
// import {
//   ClusterData,
//   ClusterSendContent,
//   GetMotClusterInfoResp
// } from './Dto/get.mot.cluster.info.dto';
// import {
//   ClusterList,
//   GetMotClusterListDto,
//   GetMotClusterListResp
// } from './Dto/get.mot.cluster.list.dto';
// import { GetMotCommonSettingResp } from './Dto/get.mot.common.setting.dto';
// import {
//   Condiction,
//   GetMotSettingInfoResp,
//   NegativeData,
//   SendSetting
// } from './Dto/get.mot.setting.info.dto';
// import { GetMotSettingListResp } from './Dto/get.mot.setting.list.dto';
// import { GetMotSettingParameterResp } from './Dto/get.mot.setting.parameter.dto';
// import { GetSendLogResp, GetSendLogtDto } from './Dto/get.send.log.dto';
// import { InsertEventDto, InsertEventResp } from './Dto/insert.event.dto';
// import { SendTestDto } from './Dto/send.test.dto';
// import { UpdateMotClusterSettingDto } from './Dto/upd.cluster.setting.dto';
// import { UpdateMotClusterContentDto } from './Dto/update.mot.cluster.content.dto';
// import { UpdateMotCommonSettingDto } from './Dto/update.mot.common.setting.dto';
// import { UpdateMotContentSettingDto } from './Dto/update.mot.content.setting.dto';
// import { UpdateMotSettingDto } from './Dto/update.mot.setting.dto';
// import { UpdateMotStateDto } from './Dto/update.mot.state.dto';
// import { ContentParameter } from './Interface/content.parameter.interface';
// import { GetRewardCardInfoResp } from './Interface/get.reward.card.info.interface';
// import { GetSendMemberInfoResp } from './Interface/get.send.member.info.interface';
// import { UpdateMotStateReq } from './Interface/update.mot.state.interface';
// import { MotRepository } from './mot.repository';
// import moment = require('moment-timezone');

// @Injectable()
// export class MotService {
//   constructor(
//     // private memberPurchaseAnalysis: MemberPurchaseAnalysis,
//     private readonly redisService: RedisService,
//     private motRepository: MotRepository,
//     private notifyRepository: NotifyRepository,
//     private memberShipService: MemberShipService,
//     private memberService: MemberService,
//     private memberRepository: MemberRepository,
//     private commonRepository: CommonRepository,
//     private permissionRepository: PermissionRepository,
//     private commonService: CommonService,
//     // private memberShipRepository: MemberShipRepository,
//     private smsProvider: SmsProvider,
//     private mailProvider: MailProvider,
//     private internalConn: MysqlProvider,
//     private pushAppProvider: PushAppProvider
//   ) {}

//   // #region 單次群發

//   /**
//    * 新增編輯單次群發建立條件
//    * @param req
//    */
//   async updateMotClusterSetting(
//     file: Express.Multer.File,
//     req: UpdateMotClusterSettingDto,
//     userId: string
//   ): Promise<{ clusterId: string }> {
//     const today = moment().tz(process.env.TIME_ZONE).valueOf();
//     if (!req?.action || !req?.motStatus) {
//       throw new CustomerException(configError._200002, HttpStatus.OK);
//     }

//     if (req?.motStatus === ENUM_MOT_STATUS.ENABLE) {
//       if (
//         !Object.values(CLUSTER_LIST_TYPE)?.includes(
//           req?.action as CLUSTER_LIST_TYPE
//         )
//       )
//         throw new CustomerException(configError._200002, HttpStatus.OK);
//       // 定期群發發送方式沒有簡訊
//       if (
//         req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.SMS) &&
//         req?.action === CLUSTER_LIST_TYPE.REGULAR
//       ) {
//         throw new CustomerException(configError._200002, HttpStatus.OK);
//       }
//       // 發送時間起始日必須大於今日
//       if (
//         req?.sendStartDate &&
//         moment
//           .tz(req?.sendStartDate, process.env.DATE_TIME, process.env.TIME_ZONE)
//           .valueOf() <= today
//       )
//         throw new CustomerException(configError._410011, HttpStatus.OK);
//       // 單次群發發送方式為簡訊時不能發送全部會員
//       if (
//         req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.SMS) &&
//         req?.sendTarget === ENUM_SEND_TARGET.ALL &&
//         req?.action === CLUSTER_LIST_TYPE.SINGLE
//       )
//         throw new CustomerException(configError._410009, HttpStatus.OK);
//       // 發送對象＝名單匯入時必須要有匯入檔案
//       if (req?.sendTarget === ENUM_SEND_TARGET.IMPORTT && !file)
//         throw new CustomerException(configError._410006, HttpStatus.OK);
//       // 定期群發沒有發送？日內的資料
//       if (
//         req?.action === CLUSTER_LIST_TYPE.REGULAR &&
//         (!req?.sendDayBefore || !req?.sendStartDate || !req?.sendEndDate)
//       ) {
//         throw new CustomerException(configError._200002, HttpStatus.OK);
//       }
//       // 定期群發選每月的話要填每月？日
//       if (
//         !req?.sendDay &&
//         req?.action === CLUSTER_LIST_TYPE.REGULAR &&
//         req?.motSendStatus === CLUSTER_EXPORT_STATUS_TYPE.EVERY_MONTH
//       ) {
//         throw new CustomerException(configError._200002, HttpStatus.OK);
//       }
//       // 發送對象＝目標會員時必須選擇目標受眾
//       if (
//         req?.sendTarget === ENUM_SEND_TARGET.TARGET &&
//         !req?.positiveData?.length
//       )
//         throw new CustomerException(configError._410007, HttpStatus.OK);
//       // 目標受眾不能超過十條
//       if (req?.positiveData?.length > 10)
//         throw new CustomerException(configError._410008, HttpStatus.OK);
//       // 排除條件不能超過五條
//       if (req?.positiveData?.length > 5)
//         throw new CustomerException(configError._410010, HttpStatus.OK);

//       // 錯誤：含忽略會員每月接收推播上限次數卻不含APP推播
//       if (
//         !req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.APP) &&
//         req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.NEGLECT_MAX_COUNT)
//       )
//         throw new CustomerException(configError._200002, HttpStatus.OK);

//       // 錯誤：會員可接收 APP 推播，即不發送簡訊 但沒選擇 APP、簡訊
//       if (
//         !req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.APP) &&
//         !req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.SMS) &&
//         req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.NO_SMS)
//       )
//         throw new CustomerException(configError._200002, HttpStatus.OK);
//     }

//     let clusterId, fileName;
//     req?.clusterId?.length
//       ? (clusterId = req?.clusterId)
//       : (clusterId = await this.getClusterLatestId());

//     const connection = await this.internalConn.getConnection();
//     try {
//       await connection.beginTransaction();

//       if (file) {
//         const mobileDate = await this.memberService.chkUploadMobileCsv(
//           file,
//           true
//         );

//         const csvMemberId = await this.memberRepository.getTempCsvMemberId(
//           mobileDate?.csvTempTableName,
//           mobileDate?.csvSql
//         );

//         const insertMapMotClusterUploadSet: string[][] = csvMemberId?.map(
//           (data) => [clusterId, data?.memberId, userId]
//         );

//         await this.motRepository.insertMotClusterMember(
//           connection,
//           insertMapMotClusterUploadSet,
//           clusterId,
//           userId
//         );

//         const today = moment().tz(process.env.TIME_ZONE).format('YYYYMMDD');
//         req.peopleCount = csvMemberId?.length;
//         req.fileUrl = mobileDate?.urls?.[0];
//         fileName = `${today}-單次群發匯入`;
//       }

//       await this.motRepository.updateMotClusterSetting(
//         connection,
//         clusterId,
//         req,
//         fileName,
//         userId
//       );

//       await connection.commit();
//     } catch (error) {
//       await connection.rollback();
//     } finally {
//       connection.release();
//     }

//     return { clusterId };
//   }

//   /**
//    * 編輯單次群發發送內容設定
//    * @param req
//    * @returns
//    */
//   async updateMotClusterContent(
//     req: UpdateMotClusterContentDto
//   ): Promise<Record<string, never>> {
//     if (
//       !Object.values(ENUM_MOT_STATUS)?.includes(
//         req?.motStatus as ENUM_MOT_STATUS
//       )
//     )
//       throw new CustomerException(configError._200002, HttpStatus.OK);

//     // btnlink 不檢查 & 訊息來源：無（開啟 APP 首頁）:0 , 內部連結：1 , 外部連結：2，外部連結才檢查: http, https
//     if (
//       req?.msgSource === 2 &&
//       !req?.msgUrl?.includes('http') &&
//       !req?.msgUrl?.includes('https')
//     )
//       throw new CustomerException(configError._410001, HttpStatus.OK);

//     await this.motRepository.updateMotClusterContent(req);

//     return {};
//   }

//   /**
//    * 取得單次群發發送內容資訊
//    * @param clusterId
//    */
//   async getMotClusterInfo(clusterId: string): Promise<GetMotClusterInfoResp> {
//     const motClusterInfo = await this.motRepository.getMotClusterInfo(
//       clusterId
//     );
//     const positiveData = [],
//       negativeData = [];
//     const result = motClusterInfo?.reduce((acc, curr, idx) => {
//       if (!idx) {
//         acc.clusterName = curr?.clusterName;
//         acc.action = curr?.action;
//         acc.clusterDescription = curr?.clusterDescription;
//         acc.motSendStatus = curr?.motSendStatus;
//         acc.startDate = curr?.startDate ?? '';
//         acc.endDate = curr?.endDate ?? '';
//         acc.sendDay = curr?.sendDay ?? 0;
//         acc.sendTime = curr?.sendTime ?? '';
//         acc.sendDayBefore = curr?.sendDayBefore ?? 0;
//         acc.sendTarget = curr?.sendTarget;
//         acc.fileUrl = curr?.fileUrl;
//         acc.fileName = curr?.fileName;
//         acc.sendMethod = [...new Set(curr?.sendMethod)];
//         acc.peopleCount = curr?.peopleCount;
//         const clusterSendContent = <ClusterSendContent>{};
//         clusterSendContent.notifyId = curr?.notifyId?.filter((x) => x)?.length
//           ? [...new Set(curr?.notifyId)]
//           : [];
//         clusterSendContent.smsContent = curr?.smsContent ?? '';
//         clusterSendContent.appPushTitle = curr?.appPushTitle ?? '';
//         clusterSendContent.appPushContent = curr?.appPushContent ?? '';
//         clusterSendContent.msgImg = curr?.msgImg ?? '';
//         clusterSendContent.msgSource = curr?.msgSource;
//         clusterSendContent.msgUrl = curr?.msgUrl ?? '';
//         clusterSendContent.msgType = curr?.msgType;
//         clusterSendContent.emailTitle = curr?.emailTitle ?? '';
//         clusterSendContent.emailContent = curr?.emailContent ?? '';
//         clusterSendContent.templatePhotoRdo = curr?.templatePhotoRdo;
//         clusterSendContent.templatePhotoImg = curr?.templatePhotoImg ?? '';
//         clusterSendContent.templateColorRdo = curr?.templateColorRdo;
//         clusterSendContent.templateColor = curr?.templateColor ?? '';
//         clusterSendContent.contentRdo = curr?.contentRdo;
//         clusterSendContent.btnColorRdo = curr?.btnColorRdo;
//         clusterSendContent.btnColor = curr?.btnColor ?? '';
//         clusterSendContent.btnWordRdo = curr?.btnWordRdo;
//         clusterSendContent.btnWord = curr?.btnWord ?? '';
//         clusterSendContent.btnWordingRdo = curr?.btnWordingRdo;
//         clusterSendContent.btnWording = curr?.btnWording ?? '';
//         clusterSendContent.btnLinkRto = curr?.btnLinkRto;
//         clusterSendContent.btnLink = curr?.btnLink ?? '';
//         acc.clusterSendContent = clusterSendContent;
//         acc.positiveData = [];
//         acc.negativeData = [];
//       }

//       if (curr?.clusterSettingType === CLUSTER_SETTING_TYPE.POSITIVE) {
//         const clusterData = <ClusterData>{};
//         clusterData.clusterType = curr?.clusterMainType;
//         clusterData.conditional = curr?.clusterConditional;
//         clusterData.setting = curr?.clusterSetting;
//         positiveData.push(clusterData);
//         acc.positiveData = positiveData;
//       }
//       if (curr?.clusterSettingType === CLUSTER_SETTING_TYPE.NEGATIVE) {
//         const clusterData = <ClusterData>{};
//         clusterData.clusterType = curr?.clusterMainType;
//         clusterData.conditional = curr?.clusterConditional;
//         clusterData.setting = curr?.clusterSetting;
//         negativeData.push(clusterData);
//         acc.negativeData = negativeData;
//       }
//       return acc;
//     }, <GetMotClusterInfoResp>{});

//     return result;
//   }

//   /**
//    * 取得單次群發列表
//    * @param req
//    */
//   async getMotClusterList(
//     req: GetMotClusterListDto
//   ): Promise<GetMotClusterListResp> {
//     if (
//       !Object.values(CLUSTER_LIST_TYPE)?.includes(
//         req?.action as CLUSTER_LIST_TYPE
//       )
//     )
//       throw new CustomerException(configError._200002, HttpStatus.OK);
//     if (
//       !Object.values(ENUM_CLUSTER_STATUS)?.includes(
//         req?.clusterStatus as ENUM_CLUSTER_STATUS
//       )
//     )
//       throw new CustomerException(configError._200002, HttpStatus.OK);
//     if (
//       req?.action === CLUSTER_LIST_TYPE.SINGLE &&
//       req?.clusterStatus === ENUM_CLUSTER_STATUS.ING
//     )
//       throw new CustomerException(configError._200002, HttpStatus.OK);

//     // 只要頁數其中一個參數未定義，就使用預設值
//     if (!req?.page || !req?.perPage) {
//       req.page = 1;
//       req.perPage = 20;
//     }

//     // 取得列表筆數＆列表
//     const clusterListInfo = await this.motRepository.getMotClusterListInfo(req);
//     const { clusterCount, clusterList, startTime } = clusterListInfo;
//     const motStartTime = startTime?.[0]?.startTime;
//     const motClusterCount = clusterCount?.[0]?.clusterCount;

//     const metaData = <MetaDataCommon>{};
//     metaData.page = req?.page;
//     metaData.perPage = req?.perPage;
//     metaData.totalCount = motClusterCount;
//     metaData.totalPage = Math.ceil(motClusterCount / req?.perPage);

//     const result = <GetMotClusterListResp>{};
//     result.metaData = metaData;

//     if (!clusterList?.[0]?.clusterId) {
//       result.clusterList = [];
//       return result;
//     }

//     /** 排序發送方式 */
//     const sortSendMethod = (
//       data: { sendMethod: string; peopleCount: number }[]
//     ) => {
//       if (!data?.length) return [];
//       const sortOrder = ['app', 'sms', 'email'];

//       data.sort((a, b) => {
//         const indexA = sortOrder.indexOf(a.sendMethod);
//         const indexB = sortOrder.indexOf(b.sendMethod);

//         // 如果 sendMethod 不在 sortOrder 中，將其排在最後
//         if (indexA === -1) return 1;
//         if (indexB === -1) return -1;

//         return indexA - indexB;
//       });
//       return data;
//     };

//     // 整理列表資料
//     const clusterResultList: ClusterList[] = clusterList?.map((x) => {
//       const newSendMethod = sortSendMethod(x?.sendMethodInfo);
//       const sendMethod = newSendMethod?.map(
//         (x) => ENUM_SETTING_SEND_METHOD_STR[x?.sendMethod]
//       );
//       const peopleCount = newSendMethod?.map((x) => x?.peopleCount);

//       let sendTime = [];
//       switch (x?.sendStatus) {
//         case CLUSTER_EXPORT_STATUS_TYPE.IMMEDIATE:
//           sendTime = [
//             `${
//               CLUSTER_EXPORT_STATUS_TYPE_STR[
//                 CLUSTER_EXPORT_STATUS_TYPE.IMMEDIATE
//               ]
//             }-發送`
//           ];
//           break;
//         case CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_DATE:
//           sendTime = [
//             x?.startDate,
//             `${
//               CLUSTER_EXPORT_STATUS_TYPE_STR[
//                 CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_DATE
//               ]
//             }-${motStartTime}發送`
//           ];
//           break;
//         case CLUSTER_EXPORT_STATUS_TYPE.EVERY_DAY:
//           sendTime = [
//             `${x?.startDate}~${x?.endDate}`,
//             `${
//               CLUSTER_EXPORT_STATUS_TYPE_STR[
//                 CLUSTER_EXPORT_STATUS_TYPE.EVERY_DAY
//               ]
//             }-${motStartTime}發送`
//           ];
//           break;
//         case CLUSTER_EXPORT_STATUS_TYPE.EVERY_MONTH:
//           sendTime = [
//             `${x?.startDate}~${x?.endDate}`,
//             `${
//               CLUSTER_EXPORT_STATUS_TYPE_STR[
//                 CLUSTER_EXPORT_STATUS_TYPE.EVERY_MONTH
//               ]
//             }-${motStartTime}發送`
//           ];
//           break;
//       }
//       delete x?.sendMethodInfo;
//       delete x?.startDate;
//       delete x?.endDate;
//       delete x?.sendStatus;
//       return {
//         ...x,
//         sendMethod,
//         peopleCount,
//         sendTime
//       };
//     });

//     result.clusterList = clusterResultList;

//     return result;
//   }

//   /**
//    * 群發設定測試發送
//    * @param clusterId
//    * @returns
//    */
//   async clusterSendTest(clusterId: string): Promise<Record<string, never>> {
//     const sendContent = await this.motRepository.getClusterSendContent(
//       clusterId
//     );

//     console.log('sendContent', sendContent);

//     const sendMethod = sendContent?.[0]?.sendMethod;

//     // 寄送 Email
//     if (sendMethod?.includes(ENUM_SETTING_SEND_METHOD.EMAIL)) {
//       const sendEmail = sendContent?.map((x) => x?.email).join(',');
//       this.mailProvider.sendEmail(
//         sendEmail,
//         sendContent?.[0]?.emailTitle,
//         sendContent?.[0]?.fullEmailContent
//       );
//     }

//     // 寄送 SMS
//     if (sendMethod?.includes(ENUM_SETTING_SEND_METHOD.SMS)) {
//       const sendMobile = sendContent?.map((x) => {
//         return x?.mobile;
//       });
//       sendMobile.forEach((x) => {
//         this.smsProvider.sendSms({
//           mobile: x,
//           message: sendContent?.[0]?.smsContent
//         });
//       });
//     }

//     // 寄送 app 推播
//     // AND 會員可接收 APP 推播，即不發送簡訊
//     if (
//       sendMethod?.includes(ENUM_SETTING_SEND_METHOD.APP) ||
//       sendMethod?.includes(ENUM_SETTING_SEND_METHOD.NO_SMS)
//     ) {
//       const sendContentForAppPush =
//         await this.motRepository.getCardNumberByMobile(sendContent);

//       sendContentForAppPush.forEach((_sendContent) => {
//         if (_sendContent?.memberCardId) {
//           const req = {
//             memberCardNumber: _sendContent?.memberCardId,
//             title: _sendContent?.appPushTitle,
//             content: _sendContent?.appPushContent,
//             image: _sendContent?.msgImg,
//             urlType: _sendContent?.msgType,
//             url: _sendContent?.msgUrl,
//             mobile: _sendContent?.mobile
//           };
//           this.pushAppProvider.pushApp(req);
//         }
//       });
//     }

//     return {};
//   }

//   /**
//    * 停用定期群發管理
//    * @param clusterId
//    * @param authMemberId
//    * @returns
//    */
//   async stopMotCluster(req): Promise<Record<string, never>> {
//     const { clusterId, iam } = req;
//     const { authMemberId } = iam;
//     // 只有定期可以停用
//     const clusterAction = (await this.getMotClusterInfo(clusterId))?.action;
//     if (clusterAction !== CLUSTER_LIST_TYPE.REGULAR) return {};

//     await this.motRepository.stopMotCluster(clusterId, authMemberId);
//     return {};
//   }

//   /**
//    * 刪除群發管理
//    * @param clusterId
//    * @param memberId
//    * @returns
//    */
//   async deleteMotCluster(req): Promise<Record<string, never>> {
//     const { clusterId, iam } = req;
//     const { authMemberId } = iam;
//     await this.motRepository.deleteMotCluster(clusterId, authMemberId);
//     return {};
//   }

//   /**
//    * 取得編號
//    * @returns
//    */
//   async getClusterLatestId(): Promise<string> {
//     let clusterId;
//     const today = moment().tz(process.env.TIME_ZONE).format('YYMMDD');

//     const lastId = await this.motRepository.getClusterLatestId(today);

//     lastId
//       ? (clusterId = `MOCL${today}${(Number(lastId) + 1)
//           .toString()
//           .padStart(3, '0')}`)
//       : (clusterId = `MOCL${today}001`);

//     return clusterId;
//   }
//   // #endregion 單次群發

//   // #region 群發通用設定

//   /**
//    * 取得群發通用設定
//    * @returns
//    */
//   async getMotCommonSetting(): Promise<GetMotCommonSettingResp> {
//     const settingInfo = await this.motRepository.getMotCommonSetting();
//     let result = <GetMotCommonSettingResp>{};

//     if (!settingInfo?.settingId) {
//       result.maxPush = null;
//       result.startTime = '';
//       result.endTime = '';
//       result.templateColor = '';
//       result.btnColor = '';
//       result.btnWord = '';
//       result.btnWording = '';
//       result.btnLink = '';
//       result.imgUrl = '';
//       return result;
//     }

//     result = settingInfo;
//     return result;
//   }

//   /**
//    * 編輯群發通用設定
//    * @param req
//    * @returns
//    */
//   async updateMotCommonSetting(
//     req: UpdateMotCommonSettingDto
//   ): Promise<Record<string, never>> {
//     if (!req?.btnLink?.includes('http') && !req?.btnLink?.includes('https'))
//       throw new CustomerException(configError._410001, HttpStatus.OK);

//     await this.motRepository.updateMotCommonSetting(req);

//     return {};
//   }

//   // #endregion 群發通用設定

//   // #region MOT 事件設定

//   /**
//    * 取得事件設定所需參數
//    * @param event 事件編號
//    */
//   async getMotSettingParameter(
//     event: string
//   ): Promise<GetMotSettingParameterResp> {
//     const notifyClass = (await this.notifyRepository.getNotifyClassList())?.map(
//       (x) => {
//         return {
//           value: x?.seq?.toString(),
//           label: x?.groupName
//         };
//       }
//     );

//     // 【文案分類-有會籍】才會需要此欄位
//     // 1.會籍到期提醒 2.即將升等/續等提醒 3.升等禮發送 4.續會禮發送
//     let sendContentTab = [];
//     if (
//       event === ENUM_EVENT.MEMBER_SHIP_END ||
//       event === ENUM_EVENT.UPGRADE_RENEWAL ||
//       event === ENUM_EVENT.UPGRADE_GIFT_SEND ||
//       event === ENUM_EVENT.RENEWAL_GIFT_SEND
//     ) {
//       // 會籍
//       const activeMemberShipId = (
//         await this.memberShipService.getMemberShipSettingList()
//       )?.settingList?.find(
//         (x) =>
//           x.settingStatus === ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
//       );
//       sendContentTab = (
//         await this.memberShipService.getMemberSettingParameter(
//           activeMemberShipId
//         )
//       )?.memberShipList;

//       sendContentTab?.shift();
//     }

//     // // 文案參數項目
//     let codeCenter = await this.redisService.getCacheData(
//       config.REDIS_KEY.CONFIG
//     );
//     if (
//       !codeCenter?.find((x) => x?.belongTo === ENUM_BELONG_TO.MOT_EVENT_WORDING)
//     ) {
//       codeCenter = await this.commonRepository.getCodeCenterList();
//       await this.redisService.setCacheData(
//         config.REDIS_KEY.CONFIG,
//         codeCenter,
//         null,
//         false
//       );
//     }
//     const wording = codeCenter
//       ?.filter(
//         (x) =>
//           x?.belongTo === ENUM_BELONG_TO.MOT_EVENT_WORDING &&
//           x?.previousCode?.split('/')?.includes(event)
//       )
//       ?.map((x) => {
//         return {
//           value: x?.code,
//           label: x?.codeName
//         };
//       });

//     // 發送方式
//     const sendMethod = Object.values(ENUM_SETTING_SEND_METHOD)?.map((x) => {
//       return {
//         value: x,
//         label: ENUM_SETTING_SEND_METHOD_STR[x]
//       };
//     });

//     const result = <GetMotSettingParameterResp>{};
//     result.notifyClass = notifyClass;
//     result.sendContentTab = sendContentTab;
//     result.wording = wording;
//     result.sendMethod = sendMethod;
//     return result;
//   }

//   /**
//    * 編輯建立條件
//    * @param req
//    * @returns
//    */
//   async updateMotSetting(
//     req: UpdateMotSettingDto
//   ): Promise<Record<string, never>> {
//     // 如果是啟用的話要檢核欄位
//     if (req?.motStatus === ENUM_MOT_STATUS.ENABLE) {
//       // 檢核條件
//       switch (req?.event) {
//         case ENUM_EVENT.REGISTER_GIFT_END:
//         case ENUM_EVENT.BIRTHDAY_GIFT_END:
//         case ENUM_EVENT.POINT_END:
//           if (
//             req?.condition?.length > 1 ||
//             !req?.condition?.[0]?.numFirst ||
//             !req?.condition?.[0]?.numSec
//           )
//             throw new CustomerException(configError._200002, HttpStatus.OK);
//           break;

//         case ENUM_EVENT.RENEWAL_GIFT_END:
//         case ENUM_EVENT.BIRTHDAY_GIFT_END:
//           req?.condition?.forEach((x) => {
//             if (!x?.numFirst && !x?.numSec)
//               throw new CustomerException(configError._200002, HttpStatus.OK);
//           });
//           break;

//         case ENUM_EVENT.MEMBER_SHIP_END:
//           req?.condition?.forEach((x) => {
//             if (!x?.numFirst)
//               throw new CustomerException(configError._200002, HttpStatus.OK);
//           });
//           break;

//         case ENUM_EVENT.UPGRADE_RENEWAL:
//           req?.condition?.forEach((x) => {
//             if (!x?.numFirst || !x?.amountStart || !x?.amountEnd)
//               throw new CustomerException(configError._200002, HttpStatus.OK);
//           });
//           break;

//         case ENUM_EVENT.REWARD_NEARLY_FINISHED:
//         case ENUM_EVENT.COUPON_END:
//         case ENUM_EVENT.WRITE_ORR_COUPON:
//           if (req?.condition?.length > 1 || !req?.condition?.[0]?.numFirst)
//             throw new CustomerException(configError._200002, HttpStatus.OK);
//           break;
//       }

//       // 錯誤：含忽略會員每月接收推播上限次數卻不含APP推播
//       if (
//         !req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.APP) &&
//         req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.NEGLECT_MAX_COUNT)
//       )
//         throw new CustomerException(configError._200002, HttpStatus.OK);

//       // 錯誤：會員可接收 APP 推播，即不發送簡訊 但沒選擇 APP、簡訊
//       if (
//         !req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.APP) &&
//         !req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.SMS) &&
//         req?.sendMethod?.includes(ENUM_SETTING_SEND_METHOD.NO_SMS)
//       )
//         throw new CustomerException(configError._200002, HttpStatus.OK);
//     }
//     await this.motRepository.updateMotSetting(req);
//     return {};
//   }

//   /**
//    * 編輯發送內容設定
//    * @param req
//    * @returns
//    */
//   async updateMotContentSetting(
//     req: UpdateMotContentSettingDto
//   ): Promise<Record<string, never>> {
//     if (
//       !Object.values(ENUM_MOT_STATUS)?.includes(
//         req?.motStatus as ENUM_MOT_STATUS
//       )
//     )
//       throw new CustomerException(configError._200002, HttpStatus.OK);

//     // btnlink 不檢查，
//     // 訊息來源：無（開啟 APP 首頁）:0 , 內部連結：1 , 外部連結：2，外部連結才檢查: http, https
//     if (
//       req?.msgSource === 2 &&
//       !req?.msgUrl?.includes('http') &&
//       !req?.msgUrl?.includes('https')
//     )
//       throw new CustomerException(configError._410001, HttpStatus.OK);

//     await this.motRepository.updateMotContentSetting(req);

//     return {};
//   }

//   /**
//    * 測試發送
//    * @param req
//    * @returns
//    */
//   async sendTest(req: SendTestDto): Promise<Record<string, never>> {
//     // 取得 MOT發送設定
//     // const motContent = await this.motRepository.getSendContent(req);
//     // 20240815 測試發送改為直接寫回Action_Event讓MOT SEND處理
//     // 取得 mot 發送通知人員
//     const sendMember = await this.motRepository.getSendMemberInfo(req);

//     await this.motRepository.insertTestSendEvent(req, sendMember);

//     // 會籍基本設定
//     // const settingId = (
//     //   await this.memberShipService.getMemberShipSettingList()
//     // )?.settingList?.find(
//     //   (x) => x.settingStatus === ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
//     // )?.settingId;
//     // const memberShipInfo = (
//     //   await this.memberShipService.getMemberShipSettingInfo(settingId)
//     // )?.memberShip;

//     // 集點卡相關
//     // let rewardCardInfo;
//     // if (req?.event?.includes('reward')) {
//     //   rewardCardInfo = await this.motRepository.getRewardCardInfo(req?.event);
//     //   sendMember.forEach((allMember) => {
//     //     const member = rewardCardInfo?.find(
//     //       (x) => x?.mobile === allMember?.mobile
//     //     );
//     //     if (!member) {
//     //       rewardCardInfo.push({
//     //         mobile: allMember?.mobile,
//     //         email: allMember?.email,
//     //         brandName: '',
//     //         cardName: '',
//     //         maxPoint: 0,
//     //         Reward_Point: 0
//     //       });
//     //     }
//     //   });
//     // }

//     // 取得發送內容需要的參數
//     // const contentParameter = await this.getContentParameter(
//     //   req?.event,
//     //   memberShipInfo,
//     //   sendMember,
//     //   rewardCardInfo
//     // );

//     // if (Boolean(motContent?.sms)) {
//     //   // 替換發送內容裡的參數
//     //   const smsSendInfo = await this.replacedContent(
//     //     motContent?.smsContent,
//     //     contentParameter
//     //   );

//     //   smsSendInfo.forEach((x) => {
//     //     this.smsProvider.sendSms({
//     //       mobile: x?.mobile,
//     //       message: x?.content
//     //     });
//     //   });
//     // }

//     // if (Boolean(motContent?.email)) {
//     //   const emailSendInfo = await this.replacedContent(
//     //     motContent?.fullEmailContent,
//     //     contentParameter
//     //   );

//     //   emailSendInfo.forEach((x) => {
//     //     this.mailProvider.sendEmail(
//     //       x?.email,
//     //       motContent?.emailTitle,
//     //       x?.content
//     //     );
//     //   });
//     // }

//     return {};
//   }

//   /**
//    * 取得發送內容需要的參數
//    * @param event 事件編號
//    * @param memberShipInfo 會籍設定資訊
//    * @param sendMember 發送通知人員
//    * @param rewardCardInfo 發送通知人員集點卡資訊
//    * @returns
//    */
//   async getContentParameter(
//     event: string,
//     memberShipInfo: MemberShip[],
//     sendMember: GetSendMemberInfoResp[],
//     rewardCardInfo: GetRewardCardInfoResp[]
//   ): Promise<ContentParameter[]> {
//     let contentParameter: ContentParameter[] = [];

//     switch (event) {
//       // 註冊通知
//       case ENUM_EVENT.REGISTER:
//         contentParameter = sendMember?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             registerDate: x?.createDate
//               ? moment(x?.createDate)
//                   .tz(process.env.TIME_ZONE)
//                   .format('YYYY年MM月DD日')
//               : ''
//           };
//         });
//         break;

//       // 註冊禮到期提醒
//       case ENUM_EVENT.REGISTER_GIFT_END:
//         contentParameter = sendMember?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             couponEndDate: x?.couponEndDate
//           };
//         });
//         break;

//       // 會籍到期提醒
//       case ENUM_EVENT.MEMBER_SHIP_END:
//         contentParameter = sendMember?.map((x) => {
//           const memberShip = memberShipInfo?.find(
//             (mem) => mem?.memberShipId === x?.memberShipId
//           );
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             memberShipName: x?.memberShipName,
//             memberShipEndDate: x?.memberShipEndDate,
//             totalAmount: x?.memberShipTotalAmount,
//             renewalDiffAmount: (memberShip?.purchasedTimes -
//               Number(x?.memberShipTotalAmount) <
//             0
//               ? 0
//               : memberShip?.purchasedTimes - Number(x?.memberShipTotalAmount)
//             ).toString(),
//             renewalDiffCount: (memberShip?.purchasedCount -
//               Number(x?.memberShipTotalCount) <
//             0
//               ? 0
//               : memberShip?.purchasedCount - Number(x?.memberShipTotalCount)
//             )?.toString()
//           };
//         });
//         break;

//       // 即將升等/續等提醒
//       case ENUM_EVENT.UPGRADE_RENEWAL:
//         contentParameter = sendMember?.map((x) => {
//           let memberShip;
//           const memberShipIndex = memberShipInfo?.findIndex(
//             (mem) => mem?.memberShipId === x?.memberShipId
//           );
//           // 最高等級 => 找續等金額、次數
//           if (memberShipIndex === memberShipInfo?.length - 1) {
//             // memberShipId 等於自己
//             memberShip = memberShipInfo?.find(
//               (mem) => mem?.memberShipId === x?.memberShipId
//             );
//           }
//           // 找升等金額、次數
//           else {
//             memberShip = memberShipInfo?.find(
//               (mem, idx) => idx === memberShipIndex + 1
//             );
//           }
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             memberShipName: x?.memberShipName,
//             memberShipEndDate: x?.memberShipEndDate,
//             totalAmount: x?.memberShipTotalAmount,
//             upgradeGiftSendDiffAmount: (memberShip?.purchasedTimes -
//               Number(x?.memberShipTotalAmount) <
//             0
//               ? 0
//               : memberShip?.purchasedTimes - Number(x?.memberShipTotalAmount)
//             ).toString(),
//             upgradeGiftSendDiffCount: (memberShip?.purchasedCount -
//               Number(x?.memberShipTotalCount) <
//             0
//               ? 0
//               : memberShip?.purchasedCount - Number(x?.memberShipTotalCount)
//             )?.toString()
//           };
//         });
//         break;

//       // 升等禮發送、續會禮發送
//       case ENUM_EVENT.UPGRADE_GIFT_SEND:
//       case ENUM_EVENT.RENEWAL_GIFT_SEND:
//         contentParameter = sendMember?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             memberShipStartDate: x?.memberShipStartDate,
//             memberShipEndDate: x?.memberShipEndDate
//           };
//         });
//         break;

//       // 升等禮到期提醒、續會禮到期提醒
//       case ENUM_EVENT.UPGRADE_GIFT_END:
//       case ENUM_EVENT.RENEWAL_GIFT_END:
//         contentParameter = sendMember?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             memberShipName: x?.memberShipName
//           };
//         });
//         break;

//       // 生日禮領取提醒、生日禮到期提醒
//       case ENUM_EVENT.BIRTHDAY_GIFT_RECEIVE:
//       case ENUM_EVENT.BIRTHDAY_GIFT_END:
//         contentParameter = sendMember?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             month: x?.birthdayMonth
//           };
//         });
//         break;

//       // 集點卡-開始集點
//       case ENUM_EVENT.REWARD_START:
//         contentParameter = rewardCardInfo?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             brandName: x?.brandName,
//             cardName: x?.cardName
//           };
//         });
//         break;

//       // 集點卡-即將集滿提醒
//       case ENUM_EVENT.REWARD_NEARLY_FINISHED:
//         contentParameter = rewardCardInfo?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             brandName: x?.brandName,
//             cardName: x?.cardName,
//             currentCardPoint: x?.currentPoint,
//             cardFullPoint: x?.maxPoint
//           };
//         });
//         break;

//       // 集點卡-已集滿
//       case ENUM_EVENT.REWARD_FINISHED:
//         contentParameter = rewardCardInfo?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             brandName: x?.brandName,
//             cardName: x?.cardName,
//             cardFullPoint: x?.maxPoint
//           };
//         });
//         break;

//       // 優惠券到期提醒
//       case ENUM_EVENT.COUPON_END:
//         contentParameter = sendMember?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             couponName: x?.couponName
//           };
//         });
//         break;

//       // 商品券待核銷提醒
//       case ENUM_EVENT.WRITE_ORR_COUPON:
//         contentParameter = sendMember?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             productName: x?.productName,
//             storeName: x?.storeName
//           };
//         });
//         break;

//       // 積點到期提醒
//       case ENUM_EVENT.POINT_END:
//         contentParameter = sendMember?.map((x) => {
//           return {
//             mobile: x?.mobile,
//             email: x?.email,
//             memberPoint: x?.point,
//             pointEndDate: x?.expiredDate
//           };
//         });
//         break;
//     }

//     return contentParameter;
//   }

//   /**
//    * 替換內容裡的參數
//    * @param content 內容
//    * @param contentParameter 參數 real 值
//    */
//   async replacedContent(
//     content: string,
//     contentParameter: ContentParameter[]
//   ): Promise<{ mobile: string; email: string; content: string }[]> {
//     const newSendContent = contentParameter?.map((x) => {
//       return {
//         mobile: x?.mobile,
//         email: x?.email,
//         content: content
//           .replace(
//             new RegExp(REPLACE_STRING.BRAND_NAME, 'g'),
//             x?.brandName ?? ''
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.CARD_FULL_POINT, 'g'),
//             x?.cardFullPoint ?? '0'
//           )
//           .replace(new RegExp(REPLACE_STRING.CARD_NAME, 'g'), x?.cardName ?? '')
//           .replace(
//             new RegExp(REPLACE_STRING.COUPON_NAME, 'g'),
//             x?.couponName ?? ''
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.CURRNET_CARD_POINT, 'g'),
//             x?.currentCardPoint ?? '0'
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.MEMBER_POINT, 'g'),
//             x?.memberPoint ?? '0'
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.MEMBER_SHIP_END_DATE, 'g'),
//             x?.memberShipEndDate ?? ''
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.MEMBER_SHIP_NAME, 'g'),
//             x?.memberShipName ?? ''
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.MEMBER_SHIP_START_DATE, 'g'),
//             x?.memberShipStartDate ?? ''
//           )
//           .replace(new RegExp(REPLACE_STRING.MONTH, 'g'), x?.month ?? '')
//           .replace(
//             new RegExp(REPLACE_STRING.POINT_END_DATE, 'g'),
//             x?.pointEndDate ?? ''
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.PRODUCT_NAME, 'g'),
//             x?.productName ?? ''
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.REGISTER_DATE, 'g'),
//             x?.registerDate ?? ''
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.REGISTER_GIFT_END_DATE, 'g'),
//             x?.registerGiftEndDate ?? ''
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.RENEWAL_DIFF_AMOUNT, 'g'),
//             x?.renewalDiffAmount ?? '0'
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.RENEWAL_DIFF_COUNT, 'g'),
//             x?.renewalDiffCount ?? '0'
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.STORE_NAME, 'g'),
//             x?.storeName ?? ''
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.TOTAL_AMOUNT, 'g'),
//             x?.totalAmount ?? '0'
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.UPGRADE_GIFT_SEND_DIFF_AMOUNT, 'g'),
//             x?.upgradeGiftSendDiffAmount ?? '0'
//           )
//           .replace(
//             new RegExp(REPLACE_STRING.UPGRADE_GIFT_SEND_DIFF_COUNT, 'g'),
//             x?.upgradeGiftSendDiffCount ?? '0'
//           )
//       };
//     });

//     return newSendContent;
//   }

//   /**
//    * 取得 MOT 設定資訊
//    * @param event
//    * @returns
//    */
//   async getMotSettingInfo(event: string): Promise<GetMotSettingInfoResp> {
//     const settingInfo = await this.motRepository.getMotSettingInfo(event);
//     let sendSettingItem = <SendSetting>{};
//     let condiction = [],
//       sendSetting = [],
//       negativeData = [];

//     const result = settingInfo?.reduce((acc, curr, index) => {
//       if (!index) {
//         acc.des = curr?.des;
//         acc.sendMethod = curr?.sendMethod?.split(',') ?? [];
//       }

//       // 建立條件
//       if (
//         !acc?.condiction?.find((x) => x?.memberShipId === curr?.memberShipId)
//       ) {
//         const condictionItem = <Condiction>{};
//         condictionItem.memberShipId = curr?.memberShipId;
//         condictionItem.memberShipName = curr?.memberShipName ?? '';
//         condictionItem.numFirst = curr?.numFirst;
//         condictionItem.numSec = curr?.numSec;
//         condictionItem.amountStart = curr?.amountStart;
//         condictionItem.amountEnd = curr?.amountEnd;
//         condiction.push(condictionItem);
//       }

//       // 發送內容設定

//       if (
//         !acc?.sendSetting?.find((x) => x?.memberShipId === curr?.memberShipId)
//       ) {
//         sendSettingItem = <SendSetting>{};
//         sendSettingItem.memberShipId = curr?.memberShipId;
//         sendSettingItem.memberShipName = curr?.memberShipName ?? '';
//         sendSettingItem.notifyId = curr?.notifyId?.filter((x) => x);
//         sendSettingItem.smsContent = curr?.smsContent;
//         sendSettingItem.appPushTitle = curr?.appPushTitle;
//         sendSettingItem.appPushContent = curr?.appPushContent;
//         sendSettingItem.msgImg = curr?.msgImg;
//         sendSettingItem.msgSource = curr?.msgSource;
//         sendSettingItem.msgUrl = curr?.msgUrl;
//         sendSettingItem.msgType = curr?.msgType;
//         sendSettingItem.emailTitle = curr?.emailTitle;
//         sendSettingItem.emailContent = curr?.emailContent;
//         sendSettingItem.templatePhotoRdo = curr?.templatePhotoRdo;
//         sendSettingItem.templatePhotoImg = curr?.templatePhotoImg;
//         sendSettingItem.templateColorRdo = curr?.templateColorRdo;
//         sendSettingItem.templateColor = curr?.templateColor;
//         sendSettingItem.contentRdo = curr?.contentRdo;
//         sendSettingItem.btnColorRdo = curr?.btnColorRdo;
//         sendSettingItem.btnColor = curr?.btnColor;
//         sendSettingItem.btnWordRdo = curr?.btnWordRdo;
//         sendSettingItem.btnWord = curr?.btnWord;
//         sendSettingItem.btnWordingRdo = curr?.btnWordingRdo;
//         sendSettingItem.btnWording = curr?.btnWording;
//         sendSettingItem.btnLinkRto = curr?.btnLinkRto;
//         sendSettingItem.btnLink = curr?.btnLink;
//         sendSetting.push(sendSettingItem);
//       }

//       // 排除條件
//       // 會因會籍關係導致排除條件呈現倍數，用此方法排除
//       let memberShipId = settingInfo[0]?.memberShipId;
//       const negativeDataItem = <NegativeData>{};
//       if (curr?.clusterMainType && memberShipId === curr?.memberShipId) {
//         negativeDataItem.clusterType = curr?.clusterMainType;
//         negativeDataItem.conditional = curr?.clusterConditional;
//         negativeDataItem.setting = curr?.clusterSetting;
//         negativeData.push(negativeDataItem);
//       }

//       acc.condiction = condiction;
//       acc.sendSetting = sendSetting;
//       acc.negativeData = negativeData ?? [];
//       return acc;
//     }, <GetMotSettingInfoResp>{});

//     // 因有可能只填一項會籍的內容設定，這樣 condiction、sendSetting 跟資料長度都會跟會籍不符，因此手動加入資料
//     const memberShip = (await this.getMotSettingParameter(event))
//       ?.sendContentTab;

//     if (memberShip?.length) {
//       if (result?.condiction?.length !== memberShip?.length) {
//         memberShip.forEach((x) => {
//           if (!result?.condiction?.find((c) => c?.memberShipId === x?.value)) {
//             const condictionItem = <Condiction>{};
//             condictionItem.memberShipId = x?.value;
//             condictionItem.memberShipName = x?.label ?? '';
//             condictionItem.numFirst = null;
//             condictionItem.numSec = null;
//             condictionItem.amountStart = null;
//             condictionItem.amountEnd = null;
//             result.condiction.push(condictionItem);
//           }
//         });
//       }

//       if (result?.sendSetting?.length !== memberShip?.length) {
//         memberShip.forEach((x) => {
//           if (result?.sendSetting?.find((c) => c?.memberShipId !== x?.value)) {
//             const newSendSettingItem = JSON.parse(
//               JSON.stringify(sendSettingItem)
//             );
//             Object.keys(newSendSettingItem).forEach((setting) => {
//               newSendSettingItem[setting] = null;
//             });
//             newSendSettingItem.memberShipId = x?.value;
//             newSendSettingItem.memberShipName = x?.label ?? '';
//             newSendSettingItem.notifyId = [];
//             result.sendSetting.push(newSendSettingItem);
//           }
//         });
//       }
//     }
//     // 如果發送內容設定有一個以上的會籍，依據會籍排序
//     if (result?.sendSetting?.length > 1) {
//       const memberShipSort = (
//         await this.getMotSettingParameter(event)
//       )?.sendContentTab?.map((x) => x?.value);
//       result.sendSetting.sort((item1, item2) => {
//         return (
//           memberShipSort.indexOf(item1?.memberShipId) -
//           memberShipSort.indexOf(item2.memberShipId)
//         );
//       });
//     }
//     return result;
//   }

//   /**
//    * 取得 MOT 設定列表
//    */
//   async getMotSettingList(): Promise<GetMotSettingListResp> {
//     // 如果連建立條件都沒有編輯，完全不能啟用
//     // 如果建立條件有編輯，但是 APP 內容沒有編輯，APP 不能啟用 ; 若 APP 內容有編輯過， APP 可以啟用
//     // 3 false 無法啟用，單獨 false 該項目無法啟用
//     const motSettingList = await this.motRepository.getMotSettingList();

//     const result = <GetMotSettingListResp>{};
//     result.settingList = motSettingList?.map((x) => {
//       let canUpdateApp, canUpdateSms, canUpdateEmail;
//       if (!x?.mainIsSave) {
//         canUpdateApp = false;
//         canUpdateSms = false;
//         canUpdateEmail = false;
//       } else {
//         canUpdateApp = x?.appTitleLength && x?.appContentLength ? true : false;
//         canUpdateSms = x?.smsContentLength ? true : false;
//         canUpdateEmail =
//           x?.emailTitleLength && x?.emailContentLength ? true : false;
//       }

//       delete x?.appTitleLength;
//       delete x?.appContentLength;
//       delete x?.smsContentLength;
//       delete x?.emailTitleLength;
//       delete x?.emailContentLength;
//       return {
//         ...x,
//         mainIsSave: Boolean(x?.mainIsSave) ?? false,
//         state: Boolean(x?.state) ?? false,
//         appPush: Boolean(x?.appPush) ?? false,
//         sms: Boolean(x?.sms) ?? false,
//         email: Boolean(x?.email) ?? false,
//         canUpdateApp,
//         canUpdateSms,
//         canUpdateEmail
//       };
//     });

//     return result;
//   }

//   /**
//    * 啟用/停用 MOT 事件
//    * @param req
//    * @returns
//    */
//   async updateMotState(req: UpdateMotStateDto): Promise<Record<string, never>> {
//     // 只有啟用才要嚴謹檢核
//     if (req?.state) {
//       const eventInfo = (await this.getMotSettingList())?.settingList?.find(
//         (x) => x?.event === req?.event
//       );
//       if (
//         !eventInfo?.canUpdateApp &&
//         !eventInfo?.canUpdateSms &&
//         !eventInfo?.canUpdateEmail
//       )
//         throw new CustomerException(configError._410002, HttpStatus.OK);

//       switch (req?.type) {
//         case ENUM_MOT_TYPE.APP:
//           if (!eventInfo?.canUpdateApp)
//             throw new CustomerException(configError._410003, HttpStatus.OK);
//           break;
//         case ENUM_MOT_TYPE.SMS:
//           if (!eventInfo?.canUpdateSms)
//             throw new CustomerException(configError._410004, HttpStatus.OK);
//           break;
//         case ENUM_MOT_TYPE.EMAIL:
//           if (!eventInfo?.canUpdateEmail)
//             throw new CustomerException(configError._410005, HttpStatus.OK);
//           break;
//       }
//     }

//     let set = <UpdateMotStateReq>{};
//     set.Alter_ID = req?.iam?.authMemberId;

//     switch (req?.type) {
//       case ENUM_MOT_TYPE.STATE:
//         set.State = req?.state;
//         break;
//       case ENUM_MOT_TYPE.APP:
//         set.App_Push = req?.state;
//         break;
//       case ENUM_MOT_TYPE.SMS:
//         set.Sms = req?.state;
//         break;
//       case ENUM_MOT_TYPE.EMAIL:
//         set.Email = req?.state;
//         break;
//     }

//     await this.motRepository.updateMotState(set, req?.event);
//     return {};
//   }

//   // #endregion MOT 事件設定

//   // #region 群發紀錄

//   /**
//    * 取得群發紀錄
//    * @param req
//    */
//   async getSendLog(req: GetSendLogtDto): Promise<GetSendLogResp> {
//     // 只要頁數其中一個參數未定義，就使用預設值
//     if (!req?.page || !req?.perPage) {
//       req.page = 1;
//       req.perPage = 20;
//     }
//     if (!req?.type) {
//       req.type = CLUSTER_LIST_TYPE.SINGLE;
//     }

//     // 取得列表筆數＆積點明細列表
//     const logInfo = await this.motRepository.getSendLog(req);
//     const { logCount, logList } = logInfo;
//     const sendLogCount = logCount?.[0]?.count;

//     const newLogList = logList?.map((x) => {
//       const sendMethod = x?.sendMethod?.map((x) => {
//         return ENUM_LOG_SEND_METHOD_STR[x];
//       });
//       return {
//         ...x,
//         sendMethod
//       };
//     });

//     const metaData = <MetaDataCommon>{};
//     metaData.page = req?.page;
//     metaData.perPage = req?.perPage;
//     metaData.totalCount = sendLogCount;
//     metaData.totalPage = Math.ceil(sendLogCount / req?.perPage);

//     const result = <GetSendLogResp>{};
//     result.metaData = metaData;
//     result.logList = newLogList;
//     return result;
//   }

//   /**
//    * 匯出單筆群發紀錄
//    * @param req
//    */
//   async exportSendLog(req: ExportSendLogDto) {
//     let codeCenter = await this.redisService.getCacheData(
//       config.REDIS_KEY.CONFIG
//     );
//     if (!codeCenter) {
//       codeCenter = await this.commonRepository.getCodeCenterList();
//       await this.redisService.setCacheData(
//         config.REDIS_KEY.CONFIG,
//         codeCenter,
//         null,
//         false
//       );
//     }

//     let eventName = codeCenter.find(
//       (x) => x?.belongTo === BELONG_TO.MOT_EVENT && x?.code === req?.event
//     )?.codeName;

//     // 單次跟定期的群發名稱要去 DB 找
//     if (!eventName) {
//       eventName = (await this.motRepository.getMotClusterInfo(req?.event))?.[0]
//         ?.clusterName;
//     }

//     const insertExportEventInfo = await this.commonService.insertExportEvent(
//       ENUM_INSERT_EXPORT_EVENT.MOT_SEND_LOG,
//       req?.iam?.authMemberId,
//       `【${eventName}】`,
//       JSON.stringify(req)
//     );

//     const csvId = insertExportEventInfo?.id;
//     const totalFileName = insertExportEventInfo?.totalFileName;

//     // 發信
//     const email = (
//       await this.permissionRepository.getMemberDetail(req?.iam?.authMemberId)
//     )?.email;
//     const password = generatePassword();
//     const insertEventResp = <InsertEventResp>{};
//     insertEventResp.Email = email;
//     insertEventResp.Event = 'exportCsv';
//     insertEventResp.Member_ID = '';
//     insertEventResp.Send_Time = '00:00';
//     insertEventResp.Send_Timing = 'rightNow';
//     insertEventResp.Push_State = 'pending';
//     insertEventResp.Sms_State = 'pending';
//     insertEventResp.Action_State = '1';
//     insertEventResp.Email_Title = `【CRM系統】${totalFileName}-密碼`;
//     insertEventResp.Email_Content = `您好：\n${totalFileName}-密碼如下\n檔案密碼：${password}\n謝謝。`;
//     await this.motRepository.insertEvent(insertEventResp);
//     await this.redisService.setCacheData(csvId, password, 60 * 60 * 48); //存兩天給排程拿密碼加密

//     return {};
//   }

//   // #endregion 群發紀錄

//   /**
//    * 新增事件
//    * @param req
//    */
//   async insertEvent(req: InsertEventDto): Promise<Record<string, never>> {
//     // 檢查事件是否有啟用，有啟用才新增事件
//     const eventState = await this.motRepository.getMotEventState(req?.event);

//     if (eventState) {
//       const set = {
//         Event: req?.event,
//         Member_ID: req?.memberId,
//         Send_Timing: req?.event === ENUM_EVENT.REGISTER ? 'rightNow' : null,
//         Send_Time: req?.event === ENUM_EVENT.REGISTER ? '00:00' : null,
//         Mobile: req?.mobile,
//         Email: req?.email
//       };

//       await this.motRepository.insertEvent(set);
//     }

//     return {};
//   }

//   /**
//    * 偵測 email 是否有被打開
//    * @param query
//    */
//   async mailTrack(query: { u: string }): Promise<Record<string, never>> {
//     const eventTrack = query?.u;
//     if (!eventTrack) return {};

//     const connection = await this.internalConn.getConnection();
//     try {
//       await connection.beginTransaction();

//       // 依據 id 取得信件資訊
//       const trackInfo = await this.motRepository.getMailTrackInfo(
//         connection,
//         eventTrack
//       );

//       // 找不到直接 return
//       // 有打開過的話也只接 return
//       if (!trackInfo?.event || Boolean(trackInfo?.isOpen)) {
//         await connection.commit();
//         connection.release();
//         return {};
//       }

//       // 沒打開過要紀錄＆打開紀錄+1
//       await this.motRepository.updateOpenCount(connection, trackInfo);
//       await this.motRepository.updateOpenEmail(connection, trackInfo);

//       await connection.commit();
//     } catch (error) {
//       await connection.rollback();
//     } finally {
//       connection.release();
//     }

//     return {};
//   }

//   /**
//    * 報表測試
//    */
//   // async reportTest() {
//   //   const thisMonth = moment().tz(process.env.TIME_ZONE).format('YYYY-MM');
//   //   const lastMonth = moment()
//   //     .tz(process.env.TIME_ZONE)
//   //     .add(-1, 'M')
//   //     .format('YYYY-MM');

//   //   const task = [];
//   //   // 本月會員消費概況
//   //   task.push(this.motRepository.getSummaryData(thisMonth));
//   //   task.push(this.motRepository.getMonthData(thisMonth));
//   //   task.push(this.motRepository.getMonthData(lastMonth));
//   //   // 新舊會員 消費分析
//   //   task.push(this.motRepository.getNewOldMemberAnalysis(thisMonth));
//   //   task.push(this.motRepository.getNewOldMemberAnalysis(lastMonth));
//   //   // 會員卡別 消費分析
//   //   task.push(this.motRepository.getTotalMemberShip());
//   //   const taskResult = await Promise.all(task);
//   //   const summaryDataInfo = taskResult?.[0];
//   //   const thisMonthDataInfo = taskResult?.[1];
//   //   const lastMonthDataInfo = taskResult?.[2];
//   //   const thisMonthNewOldData = taskResult?.[3];
//   //   const lastMonthNewOldData = taskResult?.[4];
//   //   let memberShipTotalCount = taskResult?.[5];
//   //   memberShipTotalCount = (
//   //     await this.memberShipService.sortMemberShip(memberShipTotalCount)
//   //   )?.reverse();
//   //   const memberShipId = memberShipTotalCount?.map((x) => x?.memberShipId);
//   //   const memberShipAnalysis = await this.motRepository.getMemberShipAnalysis(
//   //     memberShipId,
//   //     thisMonth
//   //   );
//   //   const lastMonthMemberShipAnalysis =
//   //     await this.motRepository.getMemberShipAnalysis(memberShipId, lastMonth);

//   //   // 本月會員消費概況
//   //   // 總會員數
//   //   const totalMemberCount = summaryDataInfo?.memberCount?.totalMemberCount;
//   //   // 本月新增會員
//   //   const monthMemberCount = Number(
//   //     summaryDataInfo?.memberCount?.monthMemberCount
//   //   );
//   //   const summaryData = [
//   //     totalMemberCount,
//   //     monthMemberCount,
//   //     summaryDataInfo?.orderCount?.orderCount
//   //   ];
//   //   const monthData = [];
//   //   monthData.push(
//   //     thisMonth?.replace('-', '/'),
//   //     lastMonth?.replace('-', '/'),
//   //     ...Object.values(thisMonthDataInfo),
//   //     ...Object.values(lastMonthDataInfo)
//   //   );

//   //   // 會員卡別 消費分析
//   //   const memberShipData = [];
//   //   memberShipTotalCount.forEach((m) => {
//   //     const memberShipCount =
//   //       memberShipAnalysis?.[`${m?.memberShipId}MemberShipCount`]; // 消費會員
//   //     const totalCount = memberShipAnalysis?.[`${m?.memberShipId}TotalCount`]; // 消費額
//   //     const realCount = memberShipAnalysis?.[`${m?.memberShipId}RealCount`]; // 消費淨額
//   //     const people = memberShipAnalysis?.[`${m?.memberShipId}People`]; // 消費來客數
//   //     const consumeCount =
//   //       memberShipAnalysis?.[`${m?.memberShipId}ConsumeCount`]; // 消費次數
//   //     // 消費會員數MoM=(本月消費會員數-上個月消費會員數)/上個月消費會員數
//   //     const lastMemberShipCount =
//   //       lastMonthMemberShipAnalysis[`${m?.memberShipId}MemberShipCount`];
//   //     let memberShipCountMoM =
//   //       (memberShipCount - lastMemberShipCount) / lastMemberShipCount;
//   //     // 會員消費淨額MoM=(本月會員消費淨額-上個月會員消費淨額)/上個月會員消費淨額
//   //     const lastRealCount =
//   //       lastMonthMemberShipAnalysis[`${m?.memberShipId}RealCount`];
//   //     let realCountMoM = (memberShipCount - lastRealCount) / lastRealCount;
//   //     if (Number(lastMemberShipCount) === 0) memberShipCountMoM = 0;
//   //     if (Number(lastRealCount) === 0) realCountMoM = 0;
//   //     memberShipData.push(
//   //       m?.memberShipName,
//   //       m?.memberCount,
//   //       Number(memberShipCount),
//   //       Number(totalCount),
//   //       Number(realCount),
//   //       Number(people),
//   //       Number(consumeCount),
//   //       isNaN(memberShipCountMoM) ? 0 : memberShipCountMoM,
//   //       isNaN(realCountMoM) ? 0 : realCountMoM
//   //     );
//   //   });

//   //   // 新舊會員消費分析
//   //   const newOldMemberData = [monthMemberCount, totalMemberCount];
//   //   Object.values(thisMonthNewOldData).forEach((x) => {
//   //     newOldMemberData.push(Number(x));
//   //   });
//   //   newOldMemberData.push(
//   //     // 消費會員數MoM
//   //     Number(lastMonthNewOldData?.thisMonthMemberCount) === 0
//   //       ? 0
//   //       : (thisMonthNewOldData?.thisMonthMemberCount -
//   //           lastMonthNewOldData?.thisMonthMemberCount) /
//   //           lastMonthNewOldData?.thisMonthMemberCount,
//   //     Number(lastMonthNewOldData?.thisMonthRealAmount) === 0
//   //       ? 0
//   //       : (thisMonthNewOldData?.thisMonthRealAmount -
//   //           lastMonthNewOldData?.thisMonthRealAmount) /
//   //           lastMonthNewOldData?.thisMonthRealAmount,
//   //     // 會員消費淨額MoM
//   //     Number(lastMonthNewOldData?.oldMemberCount) === 0
//   //       ? 0
//   //       : (thisMonthNewOldData?.oldMemberCount -
//   //           lastMonthNewOldData?.oldMemberCount) /
//   //           lastMonthNewOldData?.oldMemberCount,
//   //     Number(lastMonthNewOldData?.oldRealAmount) === 0
//   //       ? 0
//   //       : (thisMonthNewOldData?.oldRealAmount -
//   //           lastMonthNewOldData?.oldRealAmount) /
//   //           lastMonthNewOldData?.oldRealAmount
//   //   );

//   //   const data = { summaryData, monthData, memberShipData, newOldMemberData };

//   //   const excelInfo = await this.memberPurchaseAnalysis.testReport(data);
//   //   this.commonService.uploadExcel(excelInfo?.dir, excelInfo?.fileName);
//   // }

//   // TODO 點數統計，先寫在這之後搬進排程再合併一起生成
//   // async pointTest() {
//   //   const thisMonth = moment().tz(process.env.TIME_ZONE).format('YYYY-MM');

//   //   const preName = 'Member_Point_Log_';
//   //   // 本月點數概況
//   //   const startMonthDate = moment()
//   //     .tz(process.env.TIME_ZONE)
//   //     .format('YYYY-MM-01 00:00:00');
//   //   const endMonthDate = moment()
//   //     .tz(process.env.TIME_ZONE)
//   //     .endOf('day')
//   //     .format('YYYY-MM-DD 23:59:59');
//   //   let logMonthTable = getLogTableNameByMonth(
//   //     preName,
//   //     startMonthDate,
//   //     endMonthDate
//   //   );
//   //   logMonthTable = await this.commonService.getExistedTable(logMonthTable);

//   //   let monthSendPointDetail: any;
//   //   let monthExchangePoint: any;
//   //   let pointTotal: any;
//   //   if (logMonthTable?.length) {
//   //     monthSendPointDetail = await this.motRepository.getMonthSendPoint(
//   //       logMonthTable,
//   //       thisMonth
//   //     );

//   //     monthExchangePoint = await this.motRepository.getMonthExchangePoint(
//   //       thisMonth
//   //     );

//   //     pointTotal = await this.motRepository.getPointTotal();
//   //   }

//   //   const pointInfoValue = [
//   //     monthSendPointDetail?.point ?? 0,
//   //     monthExchangePoint ?? 0,
//   //     pointTotal ?? 0
//   //   ];
//   //   // 歷年點數發行&兌換
//   //   const thisYear = moment()
//   //     .tz(process.env.TIME_ZONE)
//   //     .add(-4, 'y')
//   //     .format('YYYY');
//   //   const lastYear = moment().tz(process.env.TIME_ZONE).format('YYYY');

//   //   const startYearDate = moment()
//   //     .tz(process.env.TIME_ZONE)
//   //     .add(-4, 'y')
//   //     .format('YYYY-01-01 00:00:00');
//   //   const endYearDate = moment()
//   //     .tz(process.env.TIME_ZONE)
//   //     .format('YYYY-12-31 23:59:59');

//   //   let logYearTable = getLogTableNameByMonth(
//   //     preName,
//   //     startYearDate,
//   //     endYearDate
//   //   );

//   //   logYearTable = await this.commonService.getExistedTable(logYearTable);

//   //   let sendPoint: any;
//   //   if (logYearTable?.length) {
//   //     sendPoint = await this.motRepository.getYearSendPoint(
//   //       logYearTable,
//   //       thisYear,
//   //       lastYear
//   //     );
//   //   }

//   //   const exchangePoint = await this.motRepository.getYearExchangePoint(
//   //     thisYear,
//   //     lastYear
//   //   );

//   //   let sumSendPoint = 0;
//   //   let sumExchangePoint = 0;
//   //   const pointHistoryYearValue = [];
//   //   for (let year = Number(thisYear); year <= Number(lastYear); year++) {
//   //     const sendPointVal = sendPoint?.find((x) => x.year == year)?.point ?? 0;
//   //     const exchangePointVal =
//   //       exchangePoint?.find((x) => x.year == year)?.point ?? 0;

//   //     pointHistoryYearValue.push({
//   //       year,
//   //       sendPoint: sendPointVal,
//   //       exchangePoint: exchangePointVal
//   //     });

//   //     sumSendPoint += Number(sendPointVal);
//   //     sumExchangePoint += Number(exchangePointVal);
//   //   }
//   //   pointHistoryYearValue.push({
//   //     year: '合計',
//   //     sendPoint: sumSendPoint,
//   //     exchangePoint: sumExchangePoint
//   //   });

//   //   // TODO 各品牌本月點數發行與兌換  待確認

//   //   // 現有會員持有點數分佈（報表統計當下會員持有點數）
//   //   const memberShipSettingList =
//   //     await this.memberShipRepository.getMemberShipSettingList();

//   //   const memberShipEffective = memberShipSettingList?.find(
//   //     (x) => x.settingStatus == ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
//   //   );

//   //   const getMemberSettingParameterDto = <GetMemberSettingParameterDto>{
//   //     settingId: memberShipEffective?.settingId
//   //   };
//   //   const memberShipList = await this.memberShipRepository.geMemberShipList(
//   //     getMemberSettingParameterDto
//   //   );

//   //   const memberShipNames = memberShipList?.map((x) => x.memberShipId);
//   //   const pointBalances = await this.motRepository.getMemberPointBalance(
//   //     memberShipNames
//   //   );

//   //   // 本月使用點數統計
//   //   const usedPoints = await this.motRepository.getMemberMonthUsedPoint(
//   //     thisMonth,
//   //     memberShipNames
//   //   );

//   //   const pointRanges = [
//   //     { name: '0點', val: 0 },
//   //     { name: '1~9點', val: 1 },
//   //     { name: '10~19點', val: 10 },
//   //     { name: '20~29點', val: 20 },
//   //     { name: '30~39點', val: 30 },
//   //     { name: '40~49點', val: 40 },
//   //     { name: '50~59點', val: 50 },
//   //     { name: '60~69點', val: 60 },
//   //     { name: '70~79點', val: 70 },
//   //     { name: '80~99點', val: 80 },
//   //     { name: '100~119點', val: 100 },
//   //     { name: '120~149點', val: 120 },
//   //     { name: '150~199點', val: 150 },
//   //     { name: '200~299點', val: 200 },
//   //     { name: '300~499點', val: 300 },
//   //     { name: '500~699點', val: 500 },
//   //     { name: '700~999點', val: 700 },
//   //     { name: '1,000點以上', val: 1000 }
//   //   ];

//   //   // 會員持有點數 - 合計
//   //   let sumMemberCount = 0;
//   //   let sumPointTotal = 0;
//   //   let sumLevel0 = 0;
//   //   let sumLevel1 = 0;
//   //   let sumLevel2 = 0;
//   //   const pointBalanceValue = [];
//   //   // 本月使用點數 - 合計
//   //   let sumUsedPointMemberCount = 0;
//   //   let sumUsedPointPointTotal = 0;
//   //   let sumUsedPointLevel0 = 0;
//   //   let sumUsedPointLevel1 = 0;
//   //   let sumUsedPointLevel2 = 0;
//   //   const usedPointsValue = [];
//   //   for (const pointRange of pointRanges) {
//   //     // 取得此點數區間的點數餘額
//   //     const pointBalance = pointBalances?.find(
//   //       (x) => x.pointRange == pointRange?.name
//   //     );
//   //     // 點數餘額 - 會員數
//   //     const memberCount = pointBalance?.memberCount
//   //       ? Number(pointBalance?.memberCount)
//   //       : 0;
//   //     // 點數餘額 - 點數總額
//   //     const pointTotal = memberCount * pointRange?.val;
//   //     // 點數餘額 - 星卡
//   //     const level0 = pointBalance?.level0 ? Number(pointBalance?.level0) : 0;
//   //     // 點數餘額 - 金卡
//   //     const level1 = pointBalance?.level1 ? Number(pointBalance?.level1) : 0;
//   //     // 點數餘額 - 黑卡
//   //     const level2 = pointBalance?.level2 ? Number(pointBalance?.level2) : 0;

//   //     // 取得此點數區間的使用點數
//   //     const usedPoint = usedPoints?.find(
//   //       (x) => x.pointRange == pointRange?.name
//   //     );
//   //     // 使用點數 - 會員數
//   //     const memberCountByUsedPoint = usedPoint?.memberCount
//   //       ? Number(usedPoint?.memberCount)
//   //       : 0;
//   //     // 使用點數 - 點數總額
//   //     const pointTotalByUsedPoint = memberCountByUsedPoint * pointRange?.val;
//   //     // 使用點數 - 星卡
//   //     const level0ByUsedPoint = usedPoint?.level0
//   //       ? Number(usedPoint?.level0)
//   //       : 0;
//   //     // 使用點數 - 金卡
//   //     const level1ByUsedPoint = usedPoint?.level1
//   //       ? Number(usedPoint?.level1)
//   //       : 0;
//   //     // 使用點數 - 黑卡
//   //     const level2ByUsedPoint = usedPoint?.level2
//   //       ? Number(usedPoint?.level2)
//   //       : 0;

//   //     pointBalanceValue.push({
//   //       pointRange: pointRange?.name,
//   //       memberCount: memberCount,
//   //       pointTotal: pointTotal,
//   //       level0: level0,
//   //       level1: level1,
//   //       level2: level2
//   //     });
//   //     sumMemberCount += memberCount;
//   //     sumPointTotal += pointTotal;
//   //     sumLevel0 += level0;
//   //     sumLevel1 += level1;
//   //     sumLevel2 += level2;

//   //     usedPointsValue.push({
//   //       pointRange: pointRange?.name,
//   //       memberCount: memberCountByUsedPoint,
//   //       pointTotal: pointTotalByUsedPoint,
//   //       level0: level0ByUsedPoint,
//   //       level1: level1ByUsedPoint,
//   //       level2: level2ByUsedPoint
//   //     });
//   //     sumUsedPointMemberCount += memberCountByUsedPoint;
//   //     sumUsedPointPointTotal += pointTotalByUsedPoint;
//   //     sumUsedPointLevel0 += level0ByUsedPoint;
//   //     sumUsedPointLevel1 += level1ByUsedPoint;
//   //     sumUsedPointLevel2 += level2ByUsedPoint;
//   //   }

//   //   pointBalanceValue.push({
//   //     pointRange: '合計',
//   //     memberCount: sumMemberCount,
//   //     pointTotal: sumPointTotal,
//   //     level0: sumLevel0,
//   //     level1: sumLevel1,
//   //     level2: sumLevel2
//   //   });

//   //   usedPointsValue.push({
//   //     pointRange: '合計',
//   //     memberCount: sumUsedPointMemberCount,
//   //     pointTotal: sumUsedPointPointTotal,
//   //     level0: sumUsedPointLevel0,
//   //     level1: sumUsedPointLevel1,
//   //     level2: sumUsedPointLevel2
//   //   });

//   //   const data = {
//   //     pointInfoValue,
//   //     pointHistoryYearValue,
//   //     pointBalanceValue,
//   //     usedPointsValue
//   //   };

//   //   await this.memberPurchaseAnalysis.pointTest(data);
//   // }

//   // TODO 優惠券統計，先寫在這之後搬進排程再合併一起生成
//   // async couponTest() {
//   //   const thisMonth = moment().tz(process.env.TIME_ZONE).format('YYYY-MM');
//   //   const lastMonth = moment()
//   //     .tz(process.env.TIME_ZONE)
//   //     .add(-1, 'M')
//   //     .format('YYYY-MM');

//   //   // TODO 普通兌換 各品牌券 依品牌統計 - 待確認

//   //   // TODO 普通兌換 通用券 依品牌統計 - 待確認

//   //   // 本月上架中優惠券兌換數
//   //   await this.motRepository.getCouponExchangeDetail();

//   //   // 普通兌換 依點數區間統計
//   //   const memberShipSettingList =
//   //     await this.memberShipRepository.getMemberShipSettingList();

//   //   const memberShipEffective = memberShipSettingList?.find(
//   //     (x) => x.settingStatus == ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
//   //   );

//   //   const getMemberSettingParameterDto = <GetMemberSettingParameterDto>{
//   //     settingId: memberShipEffective?.settingId
//   //   };
//   //   const memberShipList = await this.memberShipRepository.geMemberShipList(
//   //     getMemberSettingParameterDto
//   //   );

//   //   const memberShipNames = memberShipList?.map((x) => x.memberShipId);

//   //   const couponPointRanges =
//   //     await this.motRepository.getCouponPointRangeDetail(
//   //       memberShipNames,
//   //       thisMonth,
//   //       lastMonth
//   //     );

//   //   const pointRanges = [
//   //     { name: '0點', val: 0 },
//   //     { name: '1~9點', val: 1 },
//   //     { name: '10~19點', val: 10 },
//   //     { name: '20~29點', val: 20 },
//   //     { name: '30~39點', val: 30 },
//   //     { name: '40~49點', val: 40 },
//   //     { name: '50~59點', val: 50 },
//   //     { name: '60~69點', val: 60 },
//   //     { name: '70~79點', val: 70 },
//   //     { name: '80~99點', val: 80 },
//   //     { name: '100~119點', val: 100 },
//   //     { name: '120~149點', val: 120 },
//   //     { name: '150~199點', val: 150 },
//   //     { name: '200~299點', val: 200 },
//   //     { name: '300~499點', val: 300 },
//   //     { name: '500~699點', val: 500 },
//   //     { name: '700~999點', val: 700 },
//   //     { name: '1,000點以上', val: 1000 }
//   //   ];

//   //   let sumCouponCount = 0;
//   //   let sumSendCount = 0;
//   //   let sumUsedCount = 0;
//   //   let sumLevel0 = 0;
//   //   let sumLevel1 = 0;
//   //   let sumLevel2 = 0;
//   //   let sumStoreUsedCount = 0;
//   //   const couponPointRangeValue = [];
//   //   for (const pointRange of pointRanges) {
//   //     const couponPointRange = couponPointRanges?.find(
//   //       (x) => x.pointRange == pointRange?.name
//   //     );

//   //     // 架上券數
//   //     const couponCount = couponPointRange?.couponCount
//   //       ? Number(couponPointRange?.couponCount)
//   //       : 0;
//   //     // 發放券數
//   //     const sendCount = couponPointRange?.sendCount
//   //       ? Number(couponPointRange?.sendCount)
//   //       : 0;
//   //     // 使用券數
//   //     const usedCount = couponPointRange?.usedCount
//   //       ? Number(couponPointRange?.usedCount)
//   //       : 0;
//   //     // 星卡
//   //     const level0 = couponPointRange?.level0
//   //       ? Number(couponPointRange?.level0)
//   //       : 0;
//   //     // 金卡
//   //     const level1 = couponPointRange?.level1
//   //       ? Number(couponPointRange?.level1)
//   //       : 0;
//   //     // 黑卡
//   //     const level2 = couponPointRange?.level2
//   //       ? Number(couponPointRange?.level2)
//   //       : 0;
//   //     // 店均使用券數
//   //     const storeUsedCount = couponPointRange?.storeCount
//   //       ? usedCount / Number(couponPointRange?.storeCount)
//   //       : 0;
//   //     // 本月店均使用券數
//   //     const thisMonthUsedCount = couponPointRange?.thisMonthStoreCount
//   //       ? Number(couponPointRange?.thisMonthUsedCount) /
//   //         Number(couponPointRange?.thisMonthStoreCount)
//   //       : 0;
//   //     // 上月店均使用券數
//   //     const lastMonthUsedCount = couponPointRange?.lastMonthStoreCount
//   //       ? Number(couponPointRange?.lastMonthUsedCount) /
//   //         Number(couponPointRange?.lastMonthStoreCount)
//   //       : 0;
//   //     // 店均使用數 MOM
//   //     const mom =
//   //       lastMonthUsedCount == 0
//   //         ? 0
//   //         : (thisMonthUsedCount - lastMonthUsedCount) / lastMonthUsedCount;

//   //     couponPointRangeValue.push({
//   //       pointRange: pointRange?.name,
//   //       couponCount,
//   //       sendCount,
//   //       usedCount,
//   //       level0,
//   //       level1,
//   //       level2,
//   //       storeUsedCount,
//   //       mom
//   //     });

//   //     sumCouponCount += couponCount;
//   //     sumSendCount += sendCount;
//   //     sumUsedCount += usedCount;
//   //     sumLevel0 += level0;
//   //     sumLevel1 += level1;
//   //     sumLevel2 += level2;
//   //     sumStoreUsedCount += storeUsedCount;
//   //   }
//   //   couponPointRangeValue.push({
//   //     pointRange: '合計',
//   //     couponCount: sumCouponCount,
//   //     sendCount: sumSendCount,
//   //     usedCount: sumUsedCount,
//   //     level0: sumLevel0,
//   //     level1: sumLevel1,
//   //     level2: sumLevel2,
//   //     storeUsedCount: sumStoreUsedCount
//   //   });

//   //   const data = { couponPointRangeValue };

//   //   await this.memberPurchaseAnalysis.couponTest(data);
//   // }

//   // async memberInfoTest() {
//   //   const data = {};

//   //   await this.memberPurchaseAnalysis.memberInfoTest(data);
//   // }
// }

// import { HttpStatus, Injectable } from '@nestjs/common';
// import configError from 'src/Config/error.message.config';
// import { CLUSTER_SETTING_TYPE } from 'src/Definition/Enum/Cluster/cluster.setting.type.enum';
// import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
// import { ENUM_CLUSTER_STATUS } from 'src/Definition/Enum/Mot/cluster.status.enum';
// import { ENUM_MOT_STATUS } from 'src/Definition/Enum/Mot/mot.status.enum';
// import { ENUM_SETTING_SEND_METHOD } from 'src/Definition/Enum/Mot/setting.send.method.enum';
// import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
// import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
// import { mobileSplitElement, removeCountryCode } from 'src/Utils/tools';
// import { ExportSendLogDto } from './Dto/export.send.log.dto';
// import { GetMotClusterListDto } from './Dto/get.mot.cluster.list.dto';
// import { GetSendLogtDto } from './Dto/get.send.log.dto';
// import { InsertEventResp } from './Dto/insert.event.dto';
// import { SendTestDto } from './Dto/send.test.dto';
// import { UpdateMotClusterSettingDto } from './Dto/upd.cluster.setting.dto';
// import { UpdateMotClusterContentDto } from './Dto/update.mot.cluster.content.dto';
// import { UpdateMotCommonSettingDto } from './Dto/update.mot.common.setting.dto';
// import { UpdateMotContentSettingDto } from './Dto/update.mot.content.setting.dto';
// import { UpdateMotSettingDto } from './Dto/update.mot.setting.dto';
// import {
//   GetClusterSendContentResp,
//   GetClusterSendContentWithCardIdResp
// } from './Interface/get.cluster.send.content.interface';
// import { GetMailTrackInfoResp } from './Interface/get.mail.track.info.interface';
// import { GetMotClusterInfoResp } from './Interface/get.mot.cluster.info.interface';
// import { GetMotClusterListInfoResp } from './Interface/get.mot.cluster.list.info.interface';
// import { GetMotCommonSettingResp } from './Interface/get.mot.common.setting.interface';
// import { GetMotSettingInfoResp } from './Interface/get.mot.setting.info.interface';
// import { GetMotSettingListResp } from './Interface/get.mot.setting.list.interface';
// import { GetNeedExportSendLogResp } from './Interface/get.need.export.send.log';
// import { GetRewardCardInfoResp } from './Interface/get.reward.card.info.interface';
// import { GetSendContentResp } from './Interface/get.send.content.interface';
// import { GetSendLogResp } from './Interface/get.send.log.interface';
// import { GetSendMemberInfoResp } from './Interface/get.send.member.info.interface';
// import { UpdateMotStateReq } from './Interface/update.mot.state.interface';
// const moment = require('moment-timezone');
// /**
//  *
//  * @class
//  */
// @Injectable()
// export class MotRepository {
//   constructor(private internalConn: MysqlProvider) {}
//   private readonly escape = this.internalConn.escape;

//   /**
//    * 新增分群群發檔案會員
//    * @param connection
//    * @param memberId
//    * @param clusterId
//    * @param userId
//    */
//   async insertMotClusterMember(
//     connection,
//     memberSet: string[][],
//     clusterId: string,
//     userId: string
//   ): Promise<Record<string, never>> {
//     const queryStr = /* sql */ `
// UPDATE Map_Mot_Cluster_Upload
// SET Is_Active = 0, Alter_Time = CURRENT_TIMESTAMP, Alter_ID = ?
// WHERE Cluster_ID = ?;

// INSERT INTO Map_Mot_Cluster_Upload
// (Cluster_ID, Member_ID, Create_ID)
// VALUES ?;`;

//     await this.internalConn.transactionQuery(connection, queryStr, [
//       userId,
//       clusterId,
//       memberSet
//     ]);

//     return {};
//   }

//   /**
//    * 新增編輯單次群發建立條件
//    * @param req
//    * @returns
//    */
//   async updateMotClusterSetting(
//     connection,
//     clusterId: string,
//     req: UpdateMotClusterSettingDto,
//     fileName: string,
//     userId: string
//   ): Promise<Record<string, never>> {
//     let queryStr = /* sql */ `
// INSERT INTO Mot_Cluster
// (Cluster_ID, Cluster_Name, Cluster_Description, Mot_Send_Status, Send_Start_Date, Send_End_Date, Send_Day, Send_Time, Send_Day_Before, Send_Target, File_Url, File_Name, Action, People_Count, Create_ID, Alter_ID)
// VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
// ON DUPLICATE KEY UPDATE
// Cluster_Name=?, Cluster_Description=?, Mot_Send_Status=?, Send_Start_Date=?, Send_End_Date=?, Send_Day=?, Send_Time=?, Send_Day_Before=?, Send_Target=?, File_Url=?, File_Name=?, People_Count=?, Alter_ID=?, Alter_Date=CURRENT_TIMESTAMP;

// -- 初始條件設定
// UPDATE Mot_Cluster_Setting SET Is_Active = 0 WHERE Cluster_ID = ?;
// DELETE FROM Map_Mot_Cluster_Send_Method WHERE Cluster_ID = ?;

// INSERT INTO Map_Mot_Cluster_Send_Method
// (Cluster_ID, Send_Method, People_Count, Create_ID, Alter_ID)
// VALUES
// `;

//     const param = [
//       clusterId,
//       req?.clusterName,
//       req?.clusterDescription,
//       req?.motSendStatus,
//       req?.sendStartDate,
//       req?.sendEndDate,
//       req?.sendDay,
//       req?.sendTime,
//       req?.sendDayBefore,
//       req?.sendTarget,
//       req?.fileUrl,
//       fileName,
//       req?.action,
//       req?.peopleCount,
//       userId,
//       userId,
//       req?.clusterName,
//       req?.clusterDescription,
//       req?.motSendStatus,
//       req?.sendStartDate,
//       req?.sendEndDate,
//       req?.sendDay,
//       req?.sendTime,
//       req?.sendDayBefore,
//       req?.sendTarget,
//       req?.fileUrl,
//       fileName,
//       req?.peopleCount,
//       userId,
//       clusterId,
//       clusterId
//     ];

//     req.sendMethod.forEach((x, i) => {
//       let peopleCount = 0;
//       queryStr += /* sql */ `
//       (?,?,?,?,?)${i === req?.sendMethod?.length - 1 ? ';' : ','}`;
//       switch (x) {
//         case ENUM_SETTING_SEND_METHOD.APP:
//           peopleCount = req?.memberSendAppCount;
//           break;
//         case ENUM_SETTING_SEND_METHOD.SMS:
//           peopleCount = req?.memberSendSmsCount;
//           break;
//         case ENUM_SETTING_SEND_METHOD.EMAIL:
//           peopleCount = req?.memberSendEmailCount;
//           break;
//       }
//       param.push(clusterId, x, peopleCount, userId, userId);
//     });

//     if (req?.positiveData?.length || req?.negativeData?.length) {
//       queryStr += /* sql */ `
// INSERT INTO Mot_Cluster_Setting
// (Cluster_ID, Cluster_Main_Type, Cluster_Conditional, Cluster_Setting_Type, Cluster_Setting, Create_ID, Alter_ID)
// VALUES
//     `;
//       req.positiveData.forEach((x, i) => {
//         queryStr += /* sql */ `
//           (?,?,?,?,?,?,?)${
//             i === req?.positiveData?.length - 1 && !req?.negativeData?.length
//               ? ';'
//               : ','
//           }`;
//         param.push(
//           clusterId,
//           x?.clusterType,
//           x?.conditional,
//           CLUSTER_SETTING_TYPE.POSITIVE,
//           JSON.stringify(x?.setting),
//           userId,
//           userId
//         );
//       });

//       req.negativeData.forEach((x, i) => {
//         queryStr += /* sql */ `
//           (?,?,?,?,?,?,?)${i === req?.negativeData?.length - 1 ? ';' : ','}`;
//         param.push(
//           clusterId,
//           x?.clusterType,
//           x?.conditional,
//           CLUSTER_SETTING_TYPE.NEGATIVE,
//           JSON.stringify(x?.setting),
//           userId,
//           userId
//         );
//       });
//     }

//     await this.internalConn.transactionQuery(connection, queryStr, param);

//     return {};
//   }

//   /**
//    * 編輯發送內容設定
//    * @param req
//    * @returns
//    */
//   async updateMotClusterContent(
//     req: UpdateMotClusterContentDto
//   ): Promise<Record<string, never>> {
//     let queryStr = /* sql */ `
// -- MOT 群發主表 Update time
// UPDATE Mot_Cluster
// SET Cluster_Status = ?, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ?
// WHERE Cluster_ID = ?;

// -- MOT 群發發送內容
// INSERT INTO Mot_Cluster_Content
// (Cluster_ID, Sms_Content, App_Push_Title, App_Push_Content, Msg_Img, Msg_Source, Msg_Url, Msg_Type, Email_Title, Email_Content, Full_Email_Content, Template_Photo_Rdo, Template_Photo_Img, Template_Color_Rdo, Template_Color, Content_Rdo, Btn_Color_Rdo, Btn_Color, Btn_Word_Rdo, Btn_Word, Btn_Wording_Rdo, Btn_Wording, Btn_Link_Rto, Btn_Link, Create_ID, Alter_ID)
// VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// ON DUPLICATE KEY UPDATE
// Sms_Content = ?,
// App_Push_Title = ?,
// App_Push_Content = ?,
// Msg_Img = ?,
// Msg_Source = ?,
// Msg_Url = ?,
// Msg_Type = ?,
// Email_Title = ?,
// Email_Content = ?,
// Full_Email_Content = ?,
// Template_Photo_Rdo = ?,
// Template_Photo_Img = ?,
// Template_Color_Rdo = ?,
// Template_Color = ?,
// Content_Rdo = ?,
// Btn_Color_Rdo = ?,
// Btn_Color = ?,
// Btn_Word_Rdo = ?,
// Btn_Word = ?,
// Btn_Wording_Rdo = ?,
// Btn_Wording = ?,
// Btn_Link_Rto = ?,
// Btn_Link = ?,
// Alter_Date = CURRENT_TIMESTAMP,
// Alter_ID = ?;

// -- 刪除通知分類
// DELETE FROM Map_Mot_Cluster_Notify
// WHERE Cluster_ID = ?;
// `;

//     if (req?.notifyClass?.length) {
//       queryStr += /* sql */ `
// -- 新增通知分類
// INSERT INTO Map_Mot_Cluster_Notify
// (Cluster_ID, Notify_ID, Create_ID, Alter_ID)
// VALUES
//   `;
//     }

//     const param = [
//       req?.motStatus === ENUM_MOT_STATUS.DRAFT
//         ? ENUM_MOT_STATUS.DRAFT
//         : 'pending',
//       req?.iam?.authMemberId,
//       req?.clusterId,
//       req?.clusterId,
//       req?.smsContent,
//       req?.appPushTitle,
//       req?.appPushContent,
//       req?.msgImg,
//       req?.msgSource,
//       req?.msgUrl,
//       req?.msgType,
//       req?.emailTitle,
//       req?.emailContent,
//       req?.fullEmailContent,
//       req?.templatePhotoRdo,
//       req?.templatePhotoImg,
//       req?.templateColorRdo,
//       req?.templateColor,
//       req?.contentRdo,
//       req?.btnColorRdo,
//       req?.btnColor,
//       req?.btnWordRdo,
//       req?.btnWord,
//       req?.btnWordingRdo,
//       req?.btnWording,
//       req?.btnLinkRto,
//       req?.btnLink,
//       req?.iam?.authMemberId,
//       req?.iam?.authMemberId,
//       req?.smsContent,
//       req?.appPushTitle,
//       req?.appPushContent,
//       req?.msgImg,
//       req?.msgSource,
//       req?.msgUrl,
//       req?.msgType,
//       req?.emailTitle,
//       req?.emailContent,
//       req?.fullEmailContent,
//       req?.templatePhotoRdo,
//       req?.templatePhotoImg,
//       req?.templateColorRdo,
//       req?.templateColor,
//       req?.contentRdo,
//       req?.btnColorRdo,
//       req?.btnColor,
//       req?.btnWordRdo,
//       req?.btnWord,
//       req?.btnWordingRdo,
//       req?.btnWording,
//       req?.btnLinkRto,
//       req?.btnLink,
//       req?.iam?.authMemberId,
//       req?.clusterId
//     ];

//     req?.notifyClass?.forEach((x, index) => {
//       const _authMemberId = this.escape(req?.iam?.authMemberId);
//       const _event = this.escape(req?.clusterId);
//       const _notifyId = this.escape(x);

//       queryStr += /* sql */ `
// (${_event}, ${_notifyId}, ${_authMemberId}, ${_authMemberId})${
//         index === req?.notifyClass?.length - 1 ? ';' : ','
//       }`;
//     });

//     await this.internalConn.query(queryStr, param);
//     return {};
//   }

//   /**
//    * 取得單次群發發送內容資訊
//    * @param clusterId
//    * @returns
//    */
//   async getMotClusterInfo(clusterId: string): Promise<GetMotClusterInfoResp[]> {
//     const queryStr = /* sql */ `
// SELECT  mc.Cluster_Name clusterName,
//         mc.Action action,
//         mc.Cluster_Description clusterDescription,
//         mc.Mot_Send_Status motSendStatus,
//         DATE_FORMAT(mc.Send_Start_Date, '%Y/%m/%d') startDate,
//         DATE_FORMAT(mc.Send_End_Date, '%Y/%m/%d') endDate,
//         mc.Send_Day sendDay,
//         DATE_FORMAT(mc.Send_Time, '%H:%i') sendTime,
//         mc.Send_Day_Before sendDayBefore,
//         mc.Send_Target sendTarget,
//         mc.File_Url fileUrl,
//         mc.File_Name fileName,
//         mc.People_Count peopleCount,
//         JSON_ARRAYAGG(mmcn.Notify_ID) notifyId,
//         JSON_ARRAYAGG(mmcsm.Send_Method) sendMethod,
//         mcs.Cluster_Main_Type clusterMainType,
//         mcs.Cluster_Conditional clusterConditional,
//         mcs.Cluster_Setting_Type clusterSettingType,
//         mcs.Cluster_Setting clusterSetting,
//         mcc.Sms_Content smsContent,
//         mcc.App_Push_Title appPushTitle,
//         mcc.App_Push_Content appPushContent,
//         mcc.Msg_Img msgImg,
//         mcc.Msg_Source msgSource,
//         mcc.Msg_Url msgUrl,
//         mcc.Msg_Type msgType,
//         mcc.Email_Title emailTitle,
//         mcc.Email_Content emailContent,
//         mcc.Template_Photo_Rdo templatePhotoRdo,
//         mcc.Template_Photo_Img templatePhotoImg,
//         mcc.Template_Color_Rdo templateColorRdo,
//         mcc.Template_Color templateColor,
//         mcc.Content_Rdo contentRdo,
//         mcc.Btn_Color_Rdo btnColorRdo,
//         mcc.Btn_Color btnColor,
//         mcc.Btn_Word_Rdo btnWordRdo,
//         mcc.Btn_Word btnWord,
//         mcc.Btn_Wording_Rdo btnWordingRdo,
//         mcc.Btn_Wording btnWording,
//         mcc.Btn_Link_Rto btnLinkRto,
//         mcc.Btn_Link btnLink
// FROM  Mot_Cluster mc
// LEFT JOIN Map_Mot_Cluster_Notify mmcn ON mmcn.Cluster_ID = mc.Cluster_ID
// INNER JOIN Map_Mot_Cluster_Send_Method mmcsm ON mmcsm.Cluster_ID = mc.Cluster_ID
// LEFT JOIN Mot_Cluster_Content mcc ON mcc.Cluster_ID = mc.Cluster_ID
// LEFT JOIN Mot_Cluster_Setting mcs ON mcs.Cluster_ID = mc.Cluster_ID AND mcs.Is_Active = 1
// WHERE mc.Cluster_ID = ?
// GROUP BY  mcs.ID`;
//     const result = (await this.internalConn.query(queryStr, [clusterId])) ?? [];

//     return result;
//   }

//   /**
//    * 取得列表筆數＆積點發放規則列表
//    * @param req
//    */
//   async getMotClusterListInfo(
//     req: GetMotClusterListDto
//   ): Promise<GetMotClusterListInfoResp> {
//     const _start = this.escape((req?.page - 1) * req?.perPage);
//     const _limit = this.escape(req?.perPage);
//     const _clusterStatus = this.escape(req?.clusterStatus);
//     const _action = this.escape(req?.action);
//     const _search = this.escape(`%${req?.search}%`);

//     let queryCountStr = /* sql */ `
// -- 取得資料筆數
// SELECT COUNT(DISTINCT mc.Cluster_ID) clusterCount
// FROM  Mot_Cluster mc
// INNER JOIN Map_Mot_Cluster_Send_Method mmcsm ON mmcsm.Cluster_ID = mc.Cluster_ID
// WHERE mc.Cluster_Status = ${_clusterStatus} AND mc.Action = ${_action} AND mc.Is_Active = 1`;

//     let queryStr = /* sql */ `
// -- 取得列表資料
// SELECT  mc.Cluster_ID clusterId,
//         mc.Cluster_Name clusterName,
//         mc.Cluster_Description clusterDescription,
//         DATE_FORMAT(mc.Send_Start_Date, '%Y/%m/%d') startDate,
//         DATE_FORMAT(mc.Send_End_Date, '%Y/%m/%d') endDate,
//         mc.Mot_Send_Status sendStatus,
//         JSON_ARRAYAGG(JSON_OBJECT("sendMethod", mmcsm.Send_Method, "peopleCount", mmcsm.People_Count)) sendMethodInfo,
//         mc.Create_Date createTime,
//         IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = mc.Create_ID), '') createName,
//         mc.Alter_Date alterTime,
//         IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = mc.Alter_ID), '') alterName
// FROM  Mot_Cluster mc
// INNER JOIN Map_Mot_Cluster_Send_Method mmcsm ON mmcsm.Cluster_ID = mc.Cluster_ID
// WHERE mc.Cluster_Status = ${_clusterStatus} AND mc.Action = ${_action} AND mc.Is_Active = 1`;

//     if (req?.search) {
//       switch (req?.searchType) {
//         case SEARCH_ACTION_TYPES.MOT_ID:
//           queryCountStr += ` AND mc.Cluster_ID LIKE ${_search}`;
//           queryStr += ` AND mc.Cluster_ID LIKE ${_search}`;
//           break;
//         case SEARCH_ACTION_TYPES.MOT_NAME:
//           queryCountStr += ` AND mc.Cluster_Name LIKE ${_search}`;
//           queryStr += ` AND mc.Cluster_Name LIKE ${_search}`;
//           break;
//         case SEARCH_ACTION_TYPES.MOT_DESCRIPTION:
//           queryCountStr += ` AND mc.Cluster_Description LIKE ${_search}`;
//           queryStr += ` AND mc.Cluster_Description LIKE ${_search}`;
//           break;
//       }
//     }

//     queryStr += /* sql */ ` GROUP BY mc.Cluster_ID ORDER BY mc.Create_Date DESC LIMIT ${_start}, ${_limit};`;

//     queryStr += `SELECT DATE_FORMAT(Start_Time, '%H:%i') startTime FROM Mot_Management`;

//     const result =
//       (await this.internalConn.query(`${queryCountStr};${queryStr}`)) ?? [];
//     const [clusterCount, clusterList, startTime] = result;

//     return { clusterCount, clusterList, startTime };
//   }

//   /**
//    * 取得群發設定測試發送內容
//    * @param clusterId
//    */
//   async getClusterSendContent(
//     clusterId: string
//   ): Promise<GetClusterSendContentResp[]> {
//     const queryStr = /* sql */ `
// SELECT  mc.Cluster_ID clusterId,
//         CONCAT(nm.Mobile_Country_Code,nm.Mobile) mobile,
//         nm.Email email,
//         Sms_Content smsContent,
//         App_Push_Title appPushTitle,
//         App_Push_Content appPushContent,
//         Msg_Img msgImg,
//         Msg_Source msgSource,
//         Msg_Url msgUrl,
//         Msg_Type msgType,
//         Email_Title emailTitle,
//         Email_Content emailContent,
//         Full_Email_Content fullEmailContent,
//         JSON_ARRAYAGG(mmcsm.Send_Method) sendMethod
// FROM Mot_Cluster mc
// INNER JOIN Map_Mot_Cluster_Notify mmcn ON mmcn.Cluster_ID = mc.Cluster_ID
// INNER JOIN Map_Mot_Cluster_Send_Method mmcsm ON mmcsm.Cluster_ID = mc.Cluster_ID
// INNER JOIN Notify_Group_Members ngm ON ngm.Notify_Group_ID = mmcn.Notify_ID
// INNER JOIN Notify_Members nm ON nm.ID = ngm.Notify_Member_ID
// INNER JOIN Mot_Cluster_Content mcc ON mcc.Cluster_ID = mc.Cluster_ID
// WHERE mc.Cluster_ID = ?
// GROUP BY nm.ID `;
//     const result = (await this.internalConn.query(queryStr, [clusterId])) ?? [];
//     return result;
//   }

//   /**
//    * 停用定期群發管理
//    * @param clusterId
//    */
//   async stopMotCluster(
//     clusterId: string,
//     authMemberId: string
//   ): Promise<Record<string, never>> {
//     const queryStr = /* sql */ `
// UPDATE Mot_Cluster
// SET  Cluster_Status = ?, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ?
// WHERE Cluster_ID = ?;
//         `;

//     await this.internalConn.query(queryStr, [
//       ENUM_CLUSTER_STATUS.END,
//       authMemberId,
//       clusterId
//     ]);
//     return {};
//   }

//   /**
//    * 刪除群發管理
//    * @param clusterId
//    */
//   async deleteMotCluster(
//     clusterId: string,
//     authMemberId: string
//   ): Promise<Record<string, never>> {
//     const queryStr = /* sql */ `
// UPDATE Mot_Cluster
// SET  Is_Active = 0, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ?
// WHERE Cluster_ID = ?;
//     `;
//     await this.internalConn.query(queryStr, [authMemberId, clusterId]);
//     return {};
//   }

//   /**
//    * 取得最新的編號
//    * @param today 今日日期
//    * @returns
//    */
//   async getClusterLatestId(today: string): Promise<string> {
//     const _today = this.escape(`MOCL${today}%`);

//     const queryStr = /* sql */ `
// SELECT SUBSTR(Cluster_ID,11) id
// FROM Mot_Cluster
// WHERE Cluster_ID LIKE ${_today}
// ORDER BY Create_Date DESC LIMIT 1`;

//     const result = (await this.internalConn.query(queryStr)) ?? [];

//     return result?.[0]?.id ?? null;
//   }

//   /**
//    * 取得群發通用設定
//    */
//   async getMotCommonSetting(): Promise<GetMotCommonSettingResp> {
//     const queryStr = /* sql */ `
// SELECT  Setting_ID settingId,
//         Max_Push maxPush,
//         DATE_FORMAT(CONVERT_TZ(Start_Time, 'UTC','Asia/Taipei'), '%H:%i') startTime,
//         DATE_FORMAT(CONVERT_TZ(End_Time, 'UTC','Asia/Taipei'), '%H:%i') endTime,
//         Template_Color templateColor,
//         Btn_Color btnColor,
//         Btn_Word btnWord,
//         Btn_Wording btnWording,
//         Btn_Link btnLink,
//         f.Url imgUrl
// FROM Mot_Management mot
// INNER JOIN Files f ON f.Relation_ID = mot.Setting_ID;`;

//     const result = (await this.internalConn.query(queryStr)) ?? [];

//     return result?.[0];
//   }

//   /**
//    * 編輯群發通用設定
//    * @param req
//    * @returns
//    */
//   async updateMotCommonSetting(
//     req: UpdateMotCommonSettingDto
//   ): Promise<Record<string, never>> {
//     const _settingId = this.escape(
//       req?.settingId?.length ? req?.settingId : 'MOT0000001'
//     );
//     const _authMemberId = this.escape(req?.iam?.authMemberId);
//     const _maxPush = this.escape(req?.maxPush);
//     const _startTime = this.escape(
//       moment.tz(req?.startTime, 'HH:mm', 'Asia/Taipei').utc().format('HH:mm:ss')
//     );
//     const _endTime = this.escape(
//       moment.tz(req?.endTime, 'HH:mm', 'Asia/Taipei').utc().format('HH:mm:ss')
//     );
//     const _templateColor = this.escape(req?.templateColor);
//     const _btnColor = this.escape(req?.btnColor);
//     const _btnWord = this.escape(req?.btnWord);
//     const _btnWording = this.escape(req?.btnWording);
//     const _btnLink = this.escape(req?.btnLink);
//     const _imgUrl = this.escape(req?.imgUrl);

//     const queryStr = /* sql */ `
// -- 基本設定表
// INSERT INTO Mot_Management
// (Setting_ID, Max_Push, Start_Time, End_Time, Template_Color, Btn_Color, Btn_Word, Btn_Wording, Btn_Link, Create_ID, Alter_ID)
// VALUES(${_settingId}, ${_maxPush}, ${_startTime}, ${_endTime}, ${_templateColor}, ${_btnColor}, ${_btnWord}, ${_btnWording}, ${_btnLink}, ${_authMemberId}, ${_authMemberId})
// ON DUPLICATE KEY UPDATE
// Max_Push = ${_maxPush}, Start_Time = ${_startTime}, End_Time = ${_endTime}, Template_Color = ${_templateColor},
// Btn_Color = ${_btnColor}, Btn_Word = ${_btnWord}, Btn_Wording = ${_btnWording}, Btn_Link = ${_btnLink},
// Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};

// -- 圖片
// INSERT INTO Files
// (Relation_ID, Files_Type, Url, Create_ID, Alter_ID)
// VALUES(${_settingId}, 'image', ${_imgUrl}, ${_authMemberId}, ${_authMemberId})
// ON DUPLICATE KEY UPDATE
// Url = ${_imgUrl}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};
// `;

//     await this.internalConn.query(queryStr);
//     return {};
//   }

//   /**
//    * 編輯建立條件
//    * @param req
//    * @returns
//    */
//   async updateMotSetting(
//     req: UpdateMotSettingDto
//   ): Promise<Record<string, never>> {
//     const _authMemberId = this.escape(req?.iam?.authMemberId);
//     const _event = this.escape(req?.event);
//     const _des = this.escape(req?.des);
//     const _sendMethod = this.escape(req?.sendMethod?.join(','));

//     let queryStr = /* sql */ `
// -- MOT 主表
// INSERT INTO Mot_Main
// (Event, Description, Send_Method, Is_Save, Create_ID, Alter_ID)
// VALUES(${_event}, ${_des}, ${_sendMethod}, '1', ${_authMemberId}, ${_authMemberId})
// ON DUPLICATE KEY UPDATE
// Description = ${_des}, Send_Method = ${_sendMethod}, Is_Save = '1', Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};
// `;

//     req.condition.forEach((x) => {
//       const _memberShipId = this.escape(x?.memberShipId);
//       const _numFirst = this.escape(x?.numFirst);
//       const _numSec = this.escape(x?.numSec);
//       const _amountStart = this.escape(x?.amountStart);
//       const _amountEnd = this.escape(x?.amountEnd);
//       queryStr += /* sql */ `
// -- MOT 發送條件表
// INSERT INTO Mot_Send_Cond
// (Event, Member_Ship_ID, Num_First, Num_Sec, Amount_Start, Amount_End, Create_ID, Alter_ID)
// VALUES(${_event}, ${_memberShipId}, ${_numFirst}, ${_numSec}, ${_amountStart}, ${_amountEnd}, ${_authMemberId}, ${_authMemberId})
// ON DUPLICATE KEY UPDATE
// Num_First = ${_numFirst}, Num_Sec = ${_numSec}, Amount_Start = ${_amountStart}, Amount_End = ${_amountEnd}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};
// `;
//     });

//     const negativeParams = [];
//     queryStr += /* sql */ `
// UPDATE Mot_Negative_Setting SET Is_Active = 0 WHERE Event = ${_event};`;

//     if (req?.negativeData?.length) {
//       queryStr += /* sql */ `INSERT INTO Mot_Negative_Setting
// (Event, Cluster_Main_Type, Cluster_Conditional, Cluster_Setting, Create_ID, Alter_ID)
// VALUES`;
//       req.negativeData.forEach((x, i) => {
//         queryStr += /* sql */ `
//     (?,?,?,?,?,?)${i === req?.negativeData?.length - 1 ? ';' : ','}`;
//         negativeParams.push(
//           req?.event,
//           x?.clusterType,
//           x?.conditional,
//           JSON.stringify(x?.setting),
//           req?.iam?.authMemberId,
//           req?.iam?.authMemberId
//         );
//       });
//     }

//     await this.internalConn.query(queryStr, negativeParams);
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
//     let queryStr = /* sql */ `
// -- MOT 主表 Update time
// UPDATE Mot_Main
// SET State = ?, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ?
// WHERE Event = ?;

// -- MOT 發送條件表
// INSERT INTO Mot_Send_Cond
// (Event, Member_Ship_ID, Sms_Content, App_Push_Title, App_Push_Content, Msg_Img, Msg_Source, Msg_Url, Msg_Type, Email_Title, Email_Content, Full_Email_Content, Template_Photo_Rdo, Template_Photo_Img, Template_Color_Rdo, Template_Color, Content_Rdo, Btn_Color_Rdo, Btn_Color, Btn_Word_Rdo, Btn_Word, Btn_Wording_Rdo, Btn_Wording, Btn_Link_Rto, Btn_Link, Create_ID, Alter_ID)
// VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// ON DUPLICATE KEY UPDATE
// Sms_Content = ?,
// App_Push_Title = ?,
// App_Push_Content = ?,
// Msg_Img = ?,
// Msg_Source = ?,
// Msg_Url = ?,
// Msg_Type = ?,
// Email_Title = ?,
// Email_Content = ?,
// Full_Email_Content = ?,
// Template_Photo_Rdo = ?,
// Template_Photo_Img = ?,
// Template_Color_Rdo = ?,
// Template_Color = ?,
// Content_Rdo = ?,
// Btn_Color_Rdo = ?,
// Btn_Color = ?,
// Btn_Word_Rdo = ?,
// Btn_Word = ?,
// Btn_Wording_Rdo = ?,
// Btn_Wording = ?,
// Btn_Link_Rto = ?,
// Btn_Link = ?,
// Alter_Date = CURRENT_TIMESTAMP,
// Alter_ID = ?;

// -- 刪除通知分類
// DELETE FROM Map_Mot_Notify
// WHERE Event = ? AND Member_Ship_ID = ?;

// -- 新增通知分類
// INSERT INTO Map_Mot_Notify
// (Event, Member_Ship_ID, Notify_ID, Create_ID, Alter_ID)
// VALUES
// `;

//     const param = [
//       req?.motStatus === ENUM_MOT_STATUS.DRAFT ? 0 : 1,
//       req?.iam?.authMemberId,
//       req?.event,
//       req?.event,
//       req?.memberShipId,
//       req?.smsContent,
//       req?.appPushTitle,
//       req?.appPushContent,
//       req?.msgImg,
//       req?.msgSource,
//       req?.msgUrl,
//       req?.msgType,
//       req?.emailTitle,
//       req?.emailContent,
//       req?.fullEmailContent,
//       req?.templatePhotoRdo,
//       req?.templatePhotoImg,
//       req?.templateColorRdo,
//       req?.templateColor,
//       req?.contentRdo,
//       req?.btnColorRdo,
//       req?.btnColor,
//       req?.btnWordRdo,
//       req?.btnWord,
//       req?.btnWordingRdo,
//       req?.btnWording,
//       req?.btnLinkRto,
//       req?.btnLink,
//       req?.iam?.authMemberId,
//       req?.iam?.authMemberId,
//       req?.smsContent,
//       req?.appPushTitle,
//       req?.appPushContent,
//       req?.msgImg,
//       req?.msgSource,
//       req?.msgUrl,
//       req?.msgType,
//       req?.emailTitle,
//       req?.emailContent,
//       req?.fullEmailContent,
//       req?.templatePhotoRdo,
//       req?.templatePhotoImg,
//       req?.templateColorRdo,
//       req?.templateColor,
//       req?.contentRdo,
//       req?.btnColorRdo,
//       req?.btnColor,
//       req?.btnWordRdo,
//       req?.btnWord,
//       req?.btnWordingRdo,
//       req?.btnWording,
//       req?.btnLinkRto,
//       req?.btnLink,
//       req?.iam?.authMemberId,
//       req?.event,
//       req?.memberShipId
//     ];

//     req?.notifyClass?.forEach((x, index) => {
//       const _authMemberId = this.escape(req?.iam?.authMemberId);
//       const _event = this.escape(req?.event);
//       const _memberShipId = this.escape(req?.memberShipId);
//       const _notifyId = this.escape(x);

//       queryStr += /* sql */ `
// (${_event}, ${_memberShipId}, ${_notifyId}, ${_authMemberId}, ${_authMemberId})${
//         index === req?.notifyClass?.length - 1 ? ';' : ','
//       }`;
//     });

//     await this.internalConn.query(queryStr, param);
//     return {};
//   }

//   /**
//    * 取得 mot 內容
//    * @param req
//    */
//   async getSendContent(req: SendTestDto): Promise<GetSendContentResp> {
//     const _event = this.escape(req?.event);
//     const _memberShipId = this.escape(req?.memberShipId);

//     let queryStr = /* sql */ `
// SELECT  Sms_Content smsContent,
//         App_Push_Title appPushTitle,
//         App_Push_Content appPushContent,
//         Msg_Img msgImg,
//         Msg_Source msgSource,
//         Msg_Url msgUrl,
//         Msg_Type msgType,
//         Email_Title emailTitle,
//         Email_Content emailContent,
//         Full_Email_Content fullEmailContent,
//         mm.App_Push app,
//         mm.Sms sms,
//         mm.Email email
// FROM Mot_Send_Cond msc
// INNER JOIN Mot_Main mm ON mm.Event = msc.Event
// WHERE msc.Event = ${_event}`;

//     if (req?.memberShipId)
//       queryStr += /* sql */ ` AND Member_Ship_ID = ${_memberShipId}`;

//     const result = (await this.internalConn.query(queryStr)) ?? [];

//     return result?.[0];
//   }

//   /**
//    * 取得 mot 發送通知人員
//    * @param req
//    */
//   async getSendMemberInfo(req: SendTestDto): Promise<GetSendMemberInfoResp[]> {
//     const _event = this.escape(req?.event);
//     const _memberShipId = this.escape(req?.memberShipId);
//     const queryStr = /* sql */ `
//      SELECT DISTINCT
//             CONCAT(nm.Mobile_Country_Code, nm.Mobile) mobile,
//             nm.Email email
//      FROM Map_Mot_Notify mmn
//      INNER JOIN Notify_Group_Members ngm ON ngm.Notify_Group_ID = mmn.Notify_ID AND ngm.Is_Active = 1
//      INNER JOIN Notify_Members nm ON nm.ID = ngm.Notify_Member_ID
//      WHERE Event = ${_event}
//        AND Member_Ship_ID = ${_memberShipId};
//     `;
//     // SELECT DISTINCT
//     //         CONCAT(nm.Mobile_Country_Code, nm.Mobile) mobile,
//     //         nm.Email email,
//     //         im.Create_Date createDate, -- 註冊日
//     //         im.Membership_Status memberShipId,
//     //         imsb.Member_Ship_Name memberShipName,
//     //         DATE_FORMAT(im.Birthday,'%m') birthdayMonth,
//     //         MIN(coupon.Coupon_End_Date) couponEndDate, -- 註冊禮到期日
//     //         coupon1.Coupon_Name couponName, -- 優惠券名稱
//     //         DATE_FORMAT(imsl.Start_Date, '%Y年%m月%d日') memberShipStartDate,
//     //         DATE_FORMAT(imsl.End_Date, '%Y年%m月%d日') memberShipEndDate,
//     //         imsl.Total_Amount memberShipTotalAmount,
//     //         imsl.Total_Count memberShipTotalCount,
//     //         MIN(DATE_FORMAT(mp.Expired_Date, '%Y年%m月%d日')) expiredDate, -- 會員點數到期日
//     //         mp.Point point, -- 會員點數
//     //         coupon2.Store_Name storeName, -- 兌換商品核銷分店
//     //         coupon2.Coupon_Name productName -- 兌換商品名稱
//     // FROM Map_Mot_Notify mmn
//     // INNER JOIN Notify_Group_Members ngm ON ngm.Notify_Group_ID = mmn.Notify_ID
//     // INNER JOIN Notify_Members nm ON nm.ID = ngm.Notify_Member_ID
//     // INNER JOIN Member im ON im.Is_Active = '1' AND im.Mobile_Country_Code = nm.Mobile_Country_Code AND im.Mobile = nm.Mobile
//     // -- 註冊禮
//     // LEFT JOIN (SELECT MIN(cd.Coupon_End_Date) Coupon_End_Date, Exchange_Member_ID
//     // FROM Coupon_Detail cd
//     // INNER JOIN Coupon c1 ON c1.Coupon_ID = cd.Coupon_ID AND c1.Is_Active = '1' AND c1.Reward_Rules = 4
//     // WHERE cd.Transaction_Type = 1 GROUP BY Exchange_Member_ID) coupon ON coupon.Exchange_Member_ID = im.Member_ID
//     // -- 普通兌換/集點卡兌換/手動發放 之 優惠券
//     // LEFT JOIN (SELECT MIN(cd.Coupon_End_Date) Coupon_End_Date, c1.Coupon_Name, Exchange_Member_ID
//     // FROM Coupon_Detail cd
//     // INNER JOIN Coupon c1 ON c1.Coupon_ID = cd.Coupon_ID AND c1.Is_Active = '1' AND c1.Coupon_Type = 1 AND c1.Reward_Rules < 4
//     // WHERE cd.Transaction_Type = 1 GROUP BY Exchange_Member_ID) coupon1 ON coupon1.Exchange_Member_ID = im.Member_ID
//     // -- 商品券
//     // LEFT JOIN (SELECT MIN(cd.Coupon_End_Date) Coupon_End_Date, c1.Coupon_Name, s.Store_Name, Exchange_Member_ID
//     // FROM Coupon_Detail cd
//     // INNER JOIN Coupon c1 ON c1.Coupon_ID = cd.Coupon_ID AND c1.Is_Active = '1' AND c1.Coupon_Type = 2 AND c1.Reward_Rules < 4
//     // INNER JOIN Store s ON s.Store_ID = cd.Writeoff_Store_ID
//     // WHERE cd.Transaction_Type = 1 GROUP BY Exchange_Member_ID) coupon2 ON coupon2.Exchange_Member_ID = im.Member_ID
//     // -- 會籍資訊
//     // LEFT JOIN Member_Ship_Branch imsb ON imsb.Member_Ship_Branch_ID = im.Membership_Status
//     // -- 會籍紀錄
//     // LEFT JOIN Member_Ship_Log imsl ON imsl.Member_ID = im.Member_ID AND imsl.ID = (SELECT MAX(ID) FROM Member_Ship_Log WHERE Member_ID = im.Member_ID)
//     // -- 會員點數
//     // LEFT JOIN Member_Point mp ON mp.Member_ID = im.Member_ID
//     // WHERE mmn.Event = ${_event} GROUP BY mobile
//     // `;

//     const result = (await this.internalConn.query(queryStr)) ?? [];

//     return result;
//   }

//   /**
//    * 取得集點卡資訊
//    * @param event
//    * @returns
//    */
//   async getRewardCardInfo(event: string): Promise<GetRewardCardInfoResp[]> {
//     const queryStr = /* sql */ `
// SELECT DISTINCT
//         CONCAT(nm.Mobile_Country_Code, nm.Mobile) mobile,
//         nm.Email email,
//         b.Brand_Name brandName,
//         rc.Reward_Card_Name cardName,
//         rc.Reward_Card_Max_Point maxPoint,
//         rmb.Reward_Point currentPoint
// FROM Map_Mot_Notify mmn
// INNER JOIN Notify_Group_Members ngm ON ngm.Notify_Group_ID = mmn.Notify_ID
// INNER JOIN Notify_Members nm ON nm.ID = ngm.Notify_Member_ID AND nm.Is_Active = 1
// INNER JOIN Member im ON im.Is_Active = '1' AND im.Mobile_Country_Code = nm.Mobile_Country_Code AND im.Mobile = nm.Mobile
// INNER JOIN Reward_Member_Balance rmb ON rmb.Member_ID = im.Member_ID AND (rmb.Expiration_Date > NOW() OR rmb.Expiration_Date IS NULL)
// INNER JOIN Reward_Card rc ON rc.Reward_Card_ID = rmb.Reward_Card_ID AND rc.On_Sold_Start_Date <= NOW() AND rc.On_Sold_End_Date >= NOW() AND rc.Is_Active = 1
// INNER JOIN Brand b ON b.Brand_ID = rc.Brand_ID
// WHERE mmn.Event = ?
// AND rc.On_Sold_Start_Date = (SELECT MIN(On_Sold_Start_Date) FROM Reward_Member_Balance rmb INNER JOIN Reward_Card rc ON rc.Reward_Card_ID = rmb.Reward_Card_ID AND rmb.Member_ID = im.Member_ID GROUP BY rmb.Member_ID)`;

//     const result = (await this.internalConn.query(queryStr, [event])) ?? [];
//     return result;
//   }

//   /**
//    * 取得 MOT 設定資訊
//    * @param event
//    * @returns
//    */
//   async getMotSettingInfo(event: string): Promise<GetMotSettingInfoResp[]> {
//     const queryStr = /* sql */ `
// SELECT  Description des,
//         Send_Method sendMethod,
//         msc.Member_Ship_ID memberShipId,
//         imsb.Member_Ship_Name memberShipName,
//         Num_First numFirst,
//         Num_Sec numSec,
//         Amount_Start amountStart,
//         Amount_End amountEnd,
//         JSON_ARRAYAGG(mmn.Notify_ID) notifyId,
//         Sms_Content smsContent,
//         App_Push_Title appPushTitle,
//         App_Push_Content appPushContent,
//         Msg_Img msgImg,
//         Msg_Source msgSource,
//         Msg_Url msgUrl,
//         Msg_Type msgType,
//         Email_Title emailTitle,
//         Email_Content emailContent,
//         Template_Photo_Rdo templatePhotoRdo,
//         Template_Photo_Img templatePhotoImg,
//         Template_Color_Rdo templateColorRdo,
//         Template_Color templateColor,
//         Content_Rdo contentRdo,
//         Btn_Color_Rdo btnColorRdo,
//         Btn_Color btnColor,
//         Btn_Word_Rdo btnWordRdo,
//         Btn_Word btnWord,
//         Btn_Wording_Rdo btnWordingRdo,
//         Btn_Wording btnWording,
//         Btn_Link_Rto btnLinkRto,
//         Btn_Link btnLink,
//         Cluster_Main_Type clusterMainType,
//         Cluster_Conditional clusterConditional,
//         Cluster_Setting clusterSetting
// FROM Mot_Main mm
// LEFT JOIN Mot_Send_Cond msc ON mm.Event = msc.Event
// LEFT JOIN Map_Mot_Notify mmn ON mmn.Event = msc.Event AND mmn.Member_Ship_ID = msc.Member_Ship_ID
// LEFT JOIN Mot_Negative_Setting mns ON mns.Event = mm.Event AND mns.Is_Active = 1
// LEFT JOIN Member_Ship_Branch imsb ON msc.Member_Ship_ID = imsb.Member_Ship_Branch_ID
// WHERE mm.Event = ?
// GROUP BY mmn.Member_Ship_ID, mm.Event, mns.ID `;

//     const result = (await this.internalConn.query(queryStr, [event])) ?? [];
//     return result;
//   }

//   /**
//    * 取得 MOT 設定列表
//    */
//   async getMotSettingList(): Promise<GetMotSettingListResp[]> {
//     const queryStr = /* sql */ `
// SELECT  mm.Event event,
//         cc.Code_Name eventName,
//         State state,
//         App_Push appPush,
//         Sms sms,
//         Email email,
//         mm.Alter_Date alterDate,
//         mm.Is_Save mainIsSave,
//         LENGTH(msc.Sms_Content) smsContentLength,
//         LENGTH(msc.App_Push_Title) appTitleLength,
//         LENGTH(msc.App_Push_Content) appContentLength,
//         LENGTH(msc.Email_Title) emailTitleLength,
//         LENGTH(msc.Email_Content) emailContentLength,
//         IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = mm.Alter_ID ), 'system') alterId
// FROM Mot_Main mm
// LEFT JOIN Mot_Send_Cond msc ON msc.Event = mm.Event
// INNER JOIN Code_Center cc ON cc.Code = mm.Event
// GROUP BY mm.Event ORDER BY mm.Seq
//      `;

//     const result = (await this.internalConn.query(queryStr)) ?? [];

//     return result;
//   }

//   /**
//    * 啟用/停用 MOT 事件
//    * @param set
//    * @param event
//    */
//   async updateMotState(
//     set: UpdateMotStateReq,
//     event: string
//   ): Promise<Record<string, never>> {
//     const queryStr = `UPDATE Mot_Main SET ?, Alter_Date = CURRENT_TIMESTAMP WHERE Event = ?`;
//     await this.internalConn.query(queryStr, [set, event]);

//     return {};
//   }

//   /**
//    * 取得群發紀錄
//    * @param req
//    */
//   async getSendLog(req: GetSendLogtDto): Promise<GetSendLogResp> {
//     const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
//     const _limit = this.internalConn.escape(req?.perPage);
//     const _type = this.internalConn.escape(req?.type);
//     const _search = this.internalConn.escape(`%${req?.search}%`);

//     let queryCountStr = /* sql */ `
// SELECT COUNT(1) count
// FROM (
//         SELECT gml.Event, gml.Send_Date
//         FROM Group_Mot_Log gml
//         INNER JOIN Map_Count_Group_Mot_Log mcgml ON mcgml.Event = gml.Event AND mcgml.Send_Date = gml.Send_Date AND gml.id = mcgml.Hook_ID
//         LEFT JOIN Mot_Main mm ON mm.Event = gml.Event
//         WHERE gml.Log_Type = ${_type}`;

//     let queryStr = /* sql */ `
// SELECT
// gml.Event event,
// gml.Event_Name eventName,
// mm.Description eventDescription,
// DATE_FORMAT(gml.Send_Date, '%Y/%m/%d') sendDate,
// JSON_ARRAYAGG(mcgml.Send_Method) sendMethod,
// JSON_ARRAYAGG(mcgml.Expected_Count) expectedCount,
// JSON_ARRAYAGG(mcgml.Real_Count) realCount,
// JSON_ARRAYAGG(mcgml.Open_Count) openCount,
// gml.Send_Time sendTime,
// gml.Create_Date createDate,
// IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = gml.Create_ID), 'system') createName,
// gml.Alter_Date alterDate,
// IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = gml.Alter_ID), 'system') alterName
// FROM Group_Mot_Log gml
// INNER JOIN Map_Count_Group_Mot_Log mcgml ON mcgml.Event = gml.Event AND mcgml.Send_Date = gml.Send_Date AND gml.id = mcgml.Hook_ID
// LEFT JOIN Mot_Main mm ON mm.Event = gml.Event
// WHERE gml.Log_Type = ${_type}
//  `;

//     if (req?.search) {
//       switch (req?.searchType) {
//         case SEARCH_ACTION_TYPES.MOT_ID:
//           queryCountStr += ` AND gml.Event LIKE ${_search}`;
//           queryStr += ` AND gml.Event LIKE ${_search}`;
//           break;
//         case SEARCH_ACTION_TYPES.MOT_NAME:
//           queryCountStr += ` AND gml.Event_Name LIKE ${_search}`;
//           queryStr += ` AND gml.Event_Name LIKE ${_search}`;
//           break;
//         case SEARCH_ACTION_TYPES.MOT_DESCRIPTION:
//           queryCountStr += ` AND mm.Description LIKE ${_search}`;
//           queryStr += ` AND mm.Description LIKE ${_search}`;
//           break;
//       }
//     }

//     queryCountStr += /* sql */ ` GROUP BY gml.Event, gml.Send_Date
// ) subQuery`;

//     queryStr += /* sql */ `
// GROUP BY gml.Event, gml.Send_Date
// ORDER BY gml.Create_Date DESC LIMIT ${_start},${_limit}`;

//     const result = await this.internalConn.query(
//       `${queryCountStr};${queryStr}`
//     );
//     console.log('queryCountStr>>>', queryCountStr);
//     console.log('queryStr>>>', queryStr);
//     const [logCount, logList] = result;

//     return {
//       logCount,
//       logList
//     };
//   }

//   /**
//    * 取得待匯入的清單
//    * @param req
//    */
//   async getNeedExportSendLog(
//     req: ExportSendLogDto
//   ): Promise<GetNeedExportSendLogResp[]> {
//     const queryStr = /* sql */ `
// SELECT
// Card_ID cardId,
// Member_Name memberName,
// Mobile_Country_Code mobileCountryCode,
// Mobile mobile,
// Birthday birthday,
// Gender_Str gender,
// Email email,
// Member_Ship_Name memberShipName,
// Special_Str specialCode,
// Register_Date registerDate,
// Channel_Str channel
// FROM Map_Member_Group_Mot_Log
// WHERE Send_Date = ? AND Event = ?
// ORDER BY Create_Date DESC`;

//     const result = await this.internalConn.query(queryStr, [
//       req?.sendDate,
//       req?.event
//     ]);
//     return result;
//   }

//   /**
//    * 新增事件
//    * @param set
//    */
//   async insertEvent(set: InsertEventResp): Promise<Record<string, never>> {
//     const queryStr = /* sql */ `
// INSERT INTO Action_Event SET ?`;

//     await this.internalConn.query(queryStr, [set]);
//     return {};
//   }

//   /**
//    * 依據 id 取得信件資訊
//    * @param mailTrack
//    */
//   async getMailTrackInfo(
//     connection,
//     mailTrack: string
//   ): Promise<GetMailTrackInfoResp> {
//     const queryStr = /* sql */ `
// SELECT Event_Track_ID mailTrack, DATE_FORMAT(Send_Date, '%Y-%m-%d') sendDate, Member_ID memberId, Event event, Is_Open isOpen
// FROM Mot_Track_log
// WHERE Event_Track_ID = ?;
// `;

//     const result = await this.internalConn.transactionQuery(
//       connection,
//       queryStr,
//       [mailTrack]
//     );
//     return result?.[0];
//   }

//   /**
//    * 寫回實際打開次數
//    * @param connection
//    * @param eventInfo
//    */
//   async updateOpenCount(
//     connection,
//     eventInfo: GetMailTrackInfoResp
//   ): Promise<Record<string, never>> {
//     const tempTableName = `temp_group_mot_open_log`;

//     // create temp table
//     const mainSql = /* sql */ `
// CREATE TEMPORARY TABLE ${tempTableName} (
// Temp_Seq INT AUTO_INCREMENT PRIMARY KEY,
// Send_Date Date,
// Event varchar(50),
// Send_Method varchar(10));`;

//     // 組合insert 資料
//     const bulkInsertSql = /*sql */ `
// INSERT INTO ${tempTableName} (Send_Date, Event, Send_Method)
// VALUES(?,?,?);`;

//     // update state and drop temp table
//     const updateAndDropTempSql = /* sql */ `
// UPDATE Map_Count_Group_Mot_Log mainTable
// INNER JOIN
//     (
//     SELECT Send_Date, Event, Send_Method FROM ${tempTableName}
//     ) tempTable
// ON tempTable.Send_Date = mainTable.Send_Date AND tempTable.Event = mainTable.Event AND tempTable.Send_Method = mainTable.Send_Method
// SET mainTable.Open_Count = mainTable.Open_Count+1, Alter_Date = utc_timestamp(), Alter_ID = 'system';

// DROP TEMPORARY TABLE ${tempTableName};`;

//     await this.internalConn.transactionQuery(
//       connection,
//       `${mainSql} ${bulkInsertSql} ${updateAndDropTempSql}`,
//       [eventInfo?.sendDate, eventInfo?.event, 'email']
//     );

//     return {};
//   }

//   /**
//    * 紀錄信件已打開過
//    * @param connection
//    * @param eventInfo
//    */
//   async updateOpenEmail(
//     connection,
//     eventInfo: GetMailTrackInfoResp
//   ): Promise<Record<string, never>> {
//     const tempTableName = `temp_open_email`;

//     // create temp table
//     const mainSql = /* sql */ `
// CREATE TEMPORARY TABLE ${tempTableName} (
// Temp_Seq INT AUTO_INCREMENT PRIMARY KEY,
// Event_Track_ID varchar(50));`;

//     // 組合insert 資料
//     let bulkInsertSql = /*sql */ `
// INSERT INTO ${tempTableName} (Event_Track_ID)
// VALUES(?);`;

//     // update state and drop temp table
//     const updateAndDropTempSql = /* sql */ `
// UPDATE Mot_Track_log mainTable
// INNER JOIN
//     (
//     SELECT Event_Track_ID FROM ${tempTableName}
//     ) tempTable
// ON tempTable.Event_Track_ID = mainTable.Event_Track_ID
// SET mainTable.Is_Open = 1, Alter_Date = utc_timestamp();

// DROP TEMPORARY TABLE ${tempTableName};`;

//     await this.internalConn.transactionQuery(
//       connection,
//       `${mainSql} ${bulkInsertSql} ${updateAndDropTempSql}`,
//       [eventInfo?.mailTrack]
//     );

//     return {};
//   }

//   /**
//    * 會員消費概況
//    * @param thisMonth
//    * @returns
//    */
//   async getSummaryData(thisMonth) {
//     const queryStr = `
// SELECT
// count(1) totalMemberCount, -- 總會員數
// SUM(CASE WHEN POSITION(? IN Create_Date) THEN 1 ELSE 0 END) monthMemberCount -- 本月新增會員數
// FROM Member
// WHERE Is_Active = 1;

// SELECT count(DISTINCT om.Member_ID) orderCount -- 本月消費會員數
// FROM Order_Main om
// WHERE POSITION(? IN om.Transaction_Date);
// `;
//     const result =
//       (await this.internalConn.query(queryStr, [thisMonth, thisMonth])) ?? [];
//     const [memberCount, orderCount] = result;

//     return { memberCount: memberCount?.[0], orderCount: orderCount?.[0] };
//   }

//   /**
//    * 本月會員消費概況
//    * @param momth
//    * @returns
//    */
//   async getMonthData(momth: string) {
//     const queryStr = `
// SELECT
// SUM(CASE WHEN Member_ID IS NOT NULL THEN Original_Amount ELSE 0 END) memberAmount,
// SUM(CASE WHEN Member_ID IS NULL THEN Original_Amount ELSE 0 END) notMemberAmount,
// SUM(CASE WHEN Member_ID IS NOT NULL THEN Discount_Amount ELSE 0 END) memberDiscountAmount,
// SUM(CASE WHEN Member_ID IS NULL THEN Discount_Amount ELSE 0 END) notMemberDiscountAmount
// FROM Order_Main om
// INNER JOIN Order_Detail od ON od.Order_ID = om.Order_ID
// WHERE POSITION(? IN om.Transaction_Date)
// `;
//     const result = (await this.internalConn.query(queryStr, [momth])) ?? [];

//     return result?.[0];
//   }

//   /**
//    * 取得會籍消費分析
//    * @returns
//    */
//   async getNewOldMemberAnalysis(month: string) {
//     const _month = this.escape(month);
//     const _likeMonth = this.escape(`${month}%`);
//     const queryStr = `
//  SELECT
//  SUM(CASE WHEN POSITION(${_month} IN im.Create_Date) THEN 1 ELSE 0 END) thisMonthMemberCount, -- 會員數
//  SUM(CASE WHEN im.Create_Date NOT LIKE ${_likeMonth} THEN 1 ELSE 0 END) oldMemberCount,
//  SUM(CASE WHEN POSITION(${_month} IN im.Create_Date) THEN od.Original_Amount ELSE 0 END) thisMonthTotalAmount, -- 消費額
//  SUM(CASE WHEN im.Create_Date NOT LIKE ${_likeMonth}THEN od.Original_Amount ELSE 0 END) oldTotalAmount,
//  SUM(CASE WHEN POSITION(${_month} IN im.Create_Date) THEN od.Original_Amount-od.Discount_Amount ELSE 0 END) thisMonthRealAmount, -- 消費淨額
//  SUM(CASE WHEN im.Create_Date NOT LIKE ${_likeMonth} THEN od.Original_Amount-od.Discount_Amount ELSE 0 END) oldRealAmount,
//  SUM(CASE WHEN POSITION(${_month} IN im.Create_Date) THEN od.Number_of_People ELSE 0 END) thisMonthPeople, -- 消費來客數
//  SUM(CASE WHEN im.Create_Date NOT LIKE ${_likeMonth} THEN od.Number_of_People ELSE 0 END) oldPeople,
//  SUM(CASE WHEN POSITION(${_month} IN im.Create_Date)THEN 1 ELSE 0 END) thisMonthConsumeCount, -- 消費次數
//  SUM(CASE WHEN im.Create_Date NOT LIKE ${_likeMonth}THEN 1 ELSE 0 END) oldConsumeCount
//  FROM Order_Main om
//  INNER JOIN Order_Detail od ON od.Order_ID = om.Order_ID
//  INNER JOIN Member im ON im.Member_ID = om.Member_ID
//  WHERE POSITION(${_month} IN om.Transaction_Date);
//     `;

//     const result = (await this.internalConn.query(queryStr)) ?? [];
//     return result?.[0];
//   }

//   /**
//    * 取得會員會籍總數
//    * @returns
//    */
//   async getTotalMemberShip() {
//     const queryStr = `
// SELECT ie.Membership_Status memberShipId,
// CONCAT(imsb.Member_Ship_Name,'會員') memberShipName,
// imsb.Next_Ship_ID nextMemberShip,
// COUNT(1) memberCount -- 總會員數
// FROM Member_Ship ims
// INNER JOIN Member_Ship_Branch imsb ON imsb.Member_Ship_ID = ims.Member_Ship_ID
// INNER JOIN Member ie ON ie.Membership_Status = imsb.Member_Ship_Branch_ID
// WHERE ims.Member_Ship_Status = 2 AND ie.Is_Active = 1
// GROUP BY ie.Membership_Status;
// `;
//     const result = (await this.internalConn.query(queryStr)) ?? [];

//     return result;
//   }

//   /**
//    * 取得會籍消費分析
//    * @returns
//    */
//   async getMemberShipAnalysis(memberShip: string[], month: string) {
//     let selectStr = '';
//     memberShip.forEach((m, i) => {
//       selectStr += `
// SUM(CASE WHEN im.Membership_Status = '${m}' THEN 1 ELSE 0 END) '${m}MemberShipCount', -- 會員數
// SUM(CASE WHEN im.Membership_Status = '${m}' THEN od.Original_Amount ELSE 0 END) '${m}TotalCount', -- 消費額
// SUM(CASE WHEN im.Membership_Status = '${m}' THEN od.Original_Amount-od.Discount_Amount ELSE 0 END) '${m}RealCount', -- 消費淨額
// SUM(CASE WHEN im.Membership_Status = '${m}' THEN od.Number_of_People ELSE 0 END) '${m}People', -- 消費來客數
// SUM(CASE WHEN im.Membership_Status = '${m}' THEN 1 ELSE 0 END) '${m}ConsumeCount' ${
//         memberShip?.length - 1 === i ? '' : ','
//       } -- 消費次數`;
//     });

//     const queryStr = `
// SELECT ${selectStr}
// FROM Order_Main om
// INNER JOIN Order_Detail od ON od.Order_ID = om.Order_ID
// INNER JOIN Member im ON im.Member_ID = om.Member_ID
// WHERE POSITION(? IN om.Transaction_Date)
// `;

//     const result = (await this.internalConn.query(queryStr, [month])) ?? [];

//     return result?.[0];
//   }

//   /**
//    * 本月發行點數
//    *
//    * @param logTable
//    * @param thisMonth
//    * @returns
//    */
//   async getMonthSendPoint(logTable, thisMonth: string) {
//     const unionClauses = logTable
//       .map(
//         (orderTableName) => `
//           SELECT
//             Brand_ID as brandId,
//             Brand_Name as brandName,
//             SUM(Point) as point
//           FROM
//             ${orderTableName}
//           WHERE POSITION(${this.internalConn.escape(thisMonth)} IN Create_Date)
//           `
//       )
//       .join('\nUNION ALL\n');

//     const sqlStr = `
//     SELECT
//       combinedLog.brandId as brandId,
//       combinedLog.brandName as brandName,
//       SUM(combinedLog.point) as point,
//       COUNT(DISTINCT store.Store_ID) as storeCount
//     FROM (
//       ${unionClauses}
//     ) combinedLog
//     LEFT JOIN Store store ON combinedLog.brandId = store.Brand_ID AND store.Is_Active = 1
//     WHERE 1
//     `;

//     const result = await this.internalConn.query(sqlStr);

//     return result?.[0];
//   }

//   /**
//    * 取得本月兌換點數
//    *
//    * @param thisMonth
//    * @returns
//    */
//   async getMonthExchangePoint(thisMonth: string) {
//     const sqlStr = `
//     SELECT
//       SUM(Used_Point) as point
//     FROM
//       Member_Point_Used memberPointUsed
//     WHERE Is_Active = 1
//       AND POSITION(? IN Create_Date)
//     `;

//     const result = await this.internalConn.query(sqlStr, [thisMonth]);

//     return result?.[0]?.point;
//   }

//   /**
//    * 取得市面上流通的點數
//    *
//    * @returns
//    */
//   async getPointTotal() {
//     const sqlStr = `
//     SELECT
//       SUM(Point) as point
//     FROM
//       Member_Point
//     WHERE Point > 0
//       AND Expired_Date >= NOW()
//     `;

//     const result = await this.internalConn.query(sqlStr);

//     return result?.[0]?.point;
//   }

//   /**
//    * 取得年度發送點數
//    *
//    * @param logTable
//    * @param thisYear
//    * @param lastYear
//    * @returns
//    */
//   async getYearSendPoint(logTable, thisYear: string, lastYear: string) {
//     const unionClauses = logTable
//       .map(
//         (orderTableName) => `
//           SELECT
//             YEAR(Create_Date) as year,
//             SUM(Point * -1) as point
//           FROM
//             ${orderTableName}
//           WHERE YEAR(Create_Date) >= ${this.internalConn.escape(thisYear)}
//             AND YEAR(Create_Date) <= ${this.internalConn.escape(lastYear)}
//           GROUP BY YEAR(Create_Date)
//           `
//       )
//       .join('\nUNION ALL\n');

//     const sqlStr = `
//     SELECT
//       combinedLog.year as year,
//       SUM(combinedLog.point) as point
//     FROM (
//       ${unionClauses}
//     ) combinedLog
//     WHERE 1
//     GROUP BY combinedLog.year
//     `;

//     const result = await this.internalConn.query(sqlStr);

//     return result;
//   }

//   /**
//    * 取得年度兌換點數
//    *
//    * @param thisYear
//    * @param lastYear
//    * @returns
//    */
//   async getYearExchangePoint(thisYear: string, lastYear: string) {
//     const sqlStr = `
//     SELECT
//       YEAR(Create_Date) as year,
//       SUM(Used_Point) as point
//     FROM
//       Member_Point_Used
//     WHERE Is_Active = 1
//       AND YEAR(Create_Date) >= ${this.internalConn.escape(thisYear)}
//       AND YEAR(Create_Date) <= ${this.internalConn.escape(lastYear)}
//     GROUP BY YEAR(Create_Date)
//     `;

//     const result = await this.internalConn.query(sqlStr);

//     return result;
//   }

//   /**
//    * 取得兌換券兌換詳細資料
//    *
//    * @returns
//    */
//   async getCouponExchangeDetail() {
//     const sqlStr = `
//     SELECT
//       Coupon_ID as couponId,
//       Coupon_Name as couponName,
//       Reward_Rules as rewardRules
//     FROM
//       Coupon
//     WHERE Is_Active = 1
//       AND On_Sold_Start_Date <= NOW()
//       AND On_Sold_End_Date <= NOW()
//     `;

//     const result = await this.internalConn.query(sqlStr);

//     return result;
//   }

//   /**
//    * 取得兌換券點數區間詳細資料
//    *
//    * @returns
//    */
//   async getCouponPointRangeDetail(
//     memberShipNames: string[],
//     thisMonth: string,
//     lastMonth: string
//   ) {
//     const selectSql = [
//       'coupon.pointRange as pointRange',
//       'COUNT(DISTINCT coupon.couponId) as couponCount',
//       'COUNT(DISTINCT Writeoff_Store_ID) as storeCount',
//       `COUNT(DISTINCT IF(POSITION(${this.internalConn.escape(
//         thisMonth
//       )} IN couponDetail.Writeoff_Date), couponDetail.Writeoff_Store_ID, NULL)) as thisMonthStoreCount`,
//       `COUNT(DISTINCT IF(POSITION(${this.internalConn.escape(
//         lastMonth
//       )} IN couponDetail.Writeoff_Date), couponDetail.Writeoff_Store_ID, NULL)) as lastMonthStoreCount`,
//       'SUM(IF(couponDetail.Transaction_Type = 3, 1, 0)) as usedCount',
//       'SUM(IF(couponDetail.Transaction_Type IN (1, 2, 3, 5), 1, 0)) as sendCount',
//       `SUM(IF(couponDetail.Transaction_Type = 3 AND POSITION(${this.internalConn.escape(
//         thisMonth
//       )} IN couponDetail.Writeoff_Date), 1, 0)) as thisMonthUsedCount`,
//       `SUM(IF(couponDetail.Transaction_Type = 3 AND POSITION(${this.internalConn.escape(
//         lastMonth
//       )} IN couponDetail.Writeoff_Date), 1, 0)) as lastMonthUsedCount`
//     ];
//     memberShipNames?.forEach((memberShipBranchId, index) => {
//       selectSql.push(
//         `SUM(IF(memberShipBranch.Member_Ship_Branch_ID = ${this.internalConn.escape(
//           memberShipBranchId
//         )}, 1, 0)) as level${index}`
//       );
//     });

//     const sqlStr = `
//     SELECT
//       ${selectSql?.join(',')}
//     FROM (
//         SELECT
//           Coupon_ID as couponId,
//           Coupon_Point as couponPoint,
//           CASE WHEN Coupon_Point = 0 THEN '0點'
//           WHEN Coupon_Point BETWEEN 1 AND 9 THEN '1~9點'
//           WHEN Coupon_Point BETWEEN 10 AND 19 THEN '10~19點'
//           WHEN Coupon_Point BETWEEN 20 AND 29 THEN '20~29點'
//           WHEN Coupon_Point BETWEEN 30 AND 39 THEN '30~39點'
//           WHEN Coupon_Point BETWEEN 40 AND 49 THEN '40~49點'
//           WHEN Coupon_Point BETWEEN 50 AND 59 THEN '50~59點'
//           WHEN Coupon_Point BETWEEN 60 AND 69 THEN '60~69點'
//           WHEN Coupon_Point BETWEEN 70 AND 79 THEN '70~79點'
//           WHEN Coupon_Point BETWEEN 80 AND 99 THEN '80~99點'
//           WHEN Coupon_Point BETWEEN 100 AND 119 THEN '100~119點'
//           WHEN Coupon_Point BETWEEN 120 AND 149 THEN '120~149點'
//           WHEN Coupon_Point BETWEEN 150 AND 199 THEN '150~199點'
//           WHEN Coupon_Point BETWEEN 200 AND 299 THEN '200~299點'
//           WHEN Coupon_Point BETWEEN 300 AND 499 THEN '300~499點'
//           WHEN Coupon_Point BETWEEN 500 AND 699 THEN '500~699點'
//           WHEN Coupon_Point BETWEEN 700 AND 999 THEN '700~999點'
//           ELSE '1,000點以上' END AS pointRange
//         FROM
//           Coupon
//         WHERE Is_Active = 1
//           AND Reward_Rules = 1
//           AND On_Sold_Start_Date <= NOW()
//           AND On_Sold_End_Date >= NOW()
//       ) as coupon
//       LEFT JOIN Coupon_Detail couponDetail ON coupon.couponId = couponDetail.Coupon_ID AND couponDetail.Is_Active = 1
//       LEFT JOIN Member members ON couponDetail.Exchange_Member_ID = members.Member_ID AND members.Is_Active = 1
//       LEFT JOIN Member_Ship_Branch memberShipBranch ON members.Membership_Status = memberShipBranch.Member_Ship_Branch_ID AND memberShipBranch.Is_Active = 1
//     WHERE 1
//     GROUP BY coupon.pointRange
//     ORDER BY coupon.couponPoint ASC
//     `;

//     const result = await this.internalConn.query(sqlStr);

//     return result;
//   }

//   /**
//    * 取得會員持有點數
//    *
//    * @param memberShipNames
//    * @returns
//    */
//   async getMemberPointBalance(memberShipNames: string[]) {
//     const mainSelectSql = [
//       'SUM(pointTemp.memberCount) as memberCount',
//       'pointTemp.point as memberPoint',
//       'pointTemp.pointRange as pointRange'
//     ];
//     const subSelectSql = [
//       'COUNT(members.Member_ID) as memberCount',
//       'SUM(IFNULL(memberPoint.Point,0)) as point',
//       `CASE WHEN SUM(IFNULL(memberPoint.Point,0)) = 0 THEN '0點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 1 AND 9 THEN '1~9點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 10 AND 19 THEN '10~19點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 20 AND 29 THEN '20~29點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 30 AND 39 THEN '30~39點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 40 AND 49 THEN '40~49點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 50 AND 59 THEN '50~59點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 60 AND 69 THEN '60~69點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 70 AND 79 THEN '70~79點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 80 AND 99 THEN '80~99點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 100 AND 119 THEN '100~119點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 120 AND 149 THEN '120~149點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 150 AND 199 THEN '150~199點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 200 AND 299 THEN '200~299點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 300 AND 499 THEN '300~499點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 500 AND 699 THEN '500~699點'
//       WHEN SUM(IFNULL(memberPoint.Point,0)) BETWEEN 700 AND 999 THEN '700~999點'
//       ELSE '1,000點以上' END as pointRange`
//     ];
//     memberShipNames?.forEach((memberShipBranchId, index) => {
//       mainSelectSql.push(`SUM(pointTemp.level${index}) as level${index}`);
//       subSelectSql.push(
//         `SUM(IF(memberShipBranch.Member_Ship_Branch_ID = ${this.internalConn.escape(
//           memberShipBranchId
//         )}, 1, 0)) as level${index}`
//       );
//     });

//     const sqlStr = `
//     SELECT
//       ${mainSelectSql?.join(',')}
//     FROM (
//       SELECT
//         ${subSelectSql?.join(',')}
//       FROM
//         Member members
//         LEFT JOIN Member_Point memberPoint ON memberPoint.Member_ID = members.Member_ID AND memberPoint.Expired_Date >= NOW()
//         INNER JOIN Member_Ship_Branch memberShipBranch ON members.Membership_Status = memberShipBranch.Member_Ship_Branch_ID AND memberShipBranch.Is_Active = 1
//       WHERE members.Is_Active = 1
//       GROUP BY memberPoint.Member_ID
//     ) as pointTemp
//     WHERE 1
//     GROUP BY pointTemp.pointRange
//     `;

//     const result = await this.internalConn.query(sqlStr);

//     return result;
//   }

//   /**
//    * 取得該月使用點數統計
//    * @param thisMonth
//    * @param memberShipNames
//    * @returns
//    */
//   async getMemberMonthUsedPoint(thisMonth: string, memberShipNames: string[]) {
//     const mainSelectSql = [
//       'SUM(pointTemp.memberCount) as memberCount',
//       'pointTemp.point as memberPoint',
//       'pointTemp.pointRange as pointRange'
//     ];
//     const subSelectSql = [
//       'COUNT(members.Member_ID) as memberCount',
//       'SUM(IFNULL(memberPointUsed.Used_Point,0)) as point',
//       `CASE WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) = 0 THEN '0點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 1 AND 9 THEN '1~9點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 10 AND 19 THEN '10~19點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 20 AND 29 THEN '20~29點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 30 AND 39 THEN '30~39點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 40 AND 49 THEN '40~49點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 50 AND 59 THEN '50~59點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 60 AND 69 THEN '60~69點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 70 AND 79 THEN '70~79點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 80 AND 99 THEN '80~99點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 100 AND 119 THEN '100~119點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 120 AND 149 THEN '120~149點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 150 AND 199 THEN '150~199點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 200 AND 299 THEN '200~299點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 300 AND 499 THEN '300~499點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 500 AND 699 THEN '500~699點'
//       WHEN SUM(IFNULL(memberPointUsed.Used_Point,0)) BETWEEN 700 AND 999 THEN '700~999點'
//       ELSE '1,000點以上' END as pointRange`
//     ];
//     memberShipNames?.forEach((memberShipBranchId, index) => {
//       mainSelectSql.push(`SUM(pointTemp.level${index}) as level${index}`);
//       subSelectSql.push(
//         `SUM(IF(memberShipBranch.Member_Ship_Branch_ID = ${this.internalConn.escape(
//           memberShipBranchId
//         )}, 1, 0)) as level${index}`
//       );
//     });

//     const sqlStr = `
//     SELECT
//       ${mainSelectSql?.join(',')}
//     FROM (
//       SELECT
//         ${subSelectSql?.join(',')}
//       FROM
//         Member members
//         LEFT JOIN Member_Point_Used memberPointUsed ON members.Member_ID = memberPointUsed.Member_ID AND memberPointUsed.Is_Active = 1
//         INNER JOIN Member_Ship_Branch memberShipBranch ON members.Membership_Status = memberShipBranch.Member_Ship_Branch_ID AND memberShipBranch.Is_Active = 1
//       WHERE members.Is_Active = 1
//         AND POSITION(${this.internalConn.escape(
//           thisMonth
//         )} IN memberPointUsed.Create_Date)
//       GROUP BY memberPointUsed.Member_ID
//     ) pointTemp
//     WHERE 1
//     GROUP BY pointTemp.pointRange
//     `;

//     const result = await this.internalConn.query(sqlStr);

//     return result;
//   }

//   /**
//    * 取得全部會員的數量
//    * @returns
//    */
//   async getTotalMemberTouchCount(): Promise<{
//     memberIdCount: number;
//     memberSendEmailCount: string;
//     memberSendSmsCount: string;
//   }> {
//     const queryStr = /* sql */ `
// SELECT
//     COUNT(im.Member_ID) memberIdCount,
//     SUM(CASE WHEN im.Email IS NOT NULL THEN 1 ELSE 0 END) memberSendEmailCount,
//     SUM(CASE WHEN im.Mobile IS NOT NULL THEN 1 ELSE 0 END) memberSendSmsCount
// FROM Member im WHERE Is_Active = 1
//     `;

//     const result = (await this.internalConn.query(queryStr)) ?? [];

//     return result?.[0];
//   }

//   /**
//    * 嘗試藉由手機號碼取得會員卡號
//    * @returns
//    */
//   async getCardNumberByMobile(
//     sendContent: GetClusterSendContentResp[]
//   ): Promise<GetClusterSendContentWithCardIdResp[]> {
//     const sendContentWithMemberCardID = [];
//     const sqlTask = [];

//     sendContent.forEach((_content) => {
//       const { _mobile, _mobileEncode, _AES_ENCRYPT_KEY } = mobileSplitElement(
//         removeCountryCode(_content.mobile)
//       );

//       const queryStr = /* sql */ `
//         SELECT Member_CardID memberCardId
//         FROM Member
//         WHERE Mobile2 = ?
//           AND Mobile_Encode2 = TO_BASE64(aes_encrypt(?, ?))
//           AND Is_Active = 1
//       `;

//       sqlTask.push(
//         this.internalConn.query(queryStr, [
//           _mobile,
//           _mobileEncode,
//           _AES_ENCRYPT_KEY
//         ])
//       );
//     });

//     const sqlResault = await Promise.all(sqlTask);

//     sqlResault.forEach((resault, index) => {
//       sendContentWithMemberCardID.push({
//         ...sendContent[index],
//         memberCardId: resault?.[0]?.memberCardId
//           ? resault?.[0]?.memberCardId
//           : ''
//       });
//     });

//     return sendContentWithMemberCardID;
//   }

//   /**
//    * 取得事件啟用狀態
//    * @param event
//    * @returns
//    */
//   async getMotEventState(event: string): Promise<boolean> {
//     const _event = this.escape(event);
//     const queryStr = /* sql */ `
//       SELECT
//         State  state
//       FROM
//         Mot_Main mm
//       WHERE Event=${_event}
//       LIMIT 1;`;

//     const result =
//       (await this.internalConn.query(queryStr))?.[0]?.state ?? false;
//     return result;
//   }

//   /**
//    * 將測試發送事件寫入Mot事件處理
//    * @param req
//    */
//   async insertTestSendEvent(
//     req: SendTestDto,
//     sendList: GetSendMemberInfoResp[]
//   ): Promise<Record<string, never>> {
//     const checkContent = req.fullEmailContent.match(/<p[^>]*>(.*?)<\/p>/gi);
//     const titleMatch = req?.fullEmailContent.match(/<h1[^>]*>(.*?)<\/h1>/);
//     if (checkContent) {
//       // 使用 map 來提取每個 <p> 標籤中的內容
//       const innerTexts = checkContent.map((p) => {
//         const match = p.match(/<p[^>]*>(.*?)<\/p>/i);
//         return match ? match[1].trim() : '';
//       });

//       // 檢查是否有任何 <p> 標籤內容為空
//       if (innerTexts.some((text) => text.length === 0)) {
//         throw new CustomerException(configError._410005, HttpStatus.OK);
//       }
//     }
//     // seneTest格式
//     //     {
//     //   event: 'registerGiftEnd',
//     //   memberShipId: '0',
//     //   fullEmailContent: ` <div style="max-width: 600px; margin: auto; border-radius: 10px; overflow: hidden;"> <div style="text-align: center; padding-bottom: 1rem; background-color: #E0E0E0;"> <img src="https://storage.googleapis.com/download/storage/v1/b/uat_rcum_public/o/image%2Fcoupon%2F94e41e44-d8c2-4225-9510-47907426f96c.png?generation=1696473115289940&alt=media" alt="Header Image" style="max-width: 100%; height: auto;"/> <h1 style="color: black;">註冊禮到期提醒信件</h1> <div style="color: #333; padding: 0 20px;"> <p><span style="font-family: 'Noto Sans TC', sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">{=memberName=}的{=couponName=}註冊禮即將在{=couponShipEndDate=} 到期了唷!!!</span></p> </div> <div style="text-align: center; padding: 2rem 20px 0.5rem;"> <a href="https://google.com.tw" style="background-color: #e099c1; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 4px; border: 1px solid transparent; font-size: 16px; height: 48px; width: 100%; text-align: center; box-sizing: border-box;"> 按鈕文字 </a> </div></div></div>`,
//     //   iam: { authMemberId: 'qiMRS00018' }
//     // }
//     // 20240815 已與Ann確認目前只會發送Email，發送內容先同Email預覽即可不需要替換參數，讚
//     // 因為測試發送人員取的是通知設定裡面的群組，該人員不一定有會員Member_ID，所以Member_ID先不填
//     let queryStr = /* sql */ `
//         INSERT INTO CRM.Action_Event
//         (Event,
//         	Member_Ship_ID,
//         	Member_ID,
//           Send_Timing,
//         	Push_State,
//         	Email_State,
//         	Sms_State,
//         	Action_State,
//           Email_Title,
//           Email_Content,
//         	Email,
//         	Mobile,
//           Hook_ID)
//         VALUES`;
//     sendList?.forEach((info, index) => {
//       const _event = this.escape('sendTest');
//       const _memberShipId = this.escape(req?.memberShipId);
//       const _emailTitle = this.escape(titleMatch?.[1]);
//       const _emailContent = this.escape(req?.fullEmailContent);
//       const _email = this.escape(info?.email);
//       const _mobile = this.escape(info?.mobile);
//       const _hookId = this.escape(req?.event);
//       queryStr += `
// (${_event}, ${_memberShipId}, '', 'rightNow', 'pending', 'processed', 'pending', 1, ${_emailTitle}, ${_emailContent}, ${_email}, ${_mobile}, ${_hookId})${
//         index === sendList?.length - 1 ? ';' : ','
//       }`;
//     });

//     (await this.internalConn.query(queryStr)) ?? [];

//     return {};
//   }
// }

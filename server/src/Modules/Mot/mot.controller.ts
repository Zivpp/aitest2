// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Headers,
//   Patch,
//   Post,
//   Req,
//   UploadedFile,
//   UseInterceptors,
//   VERSION_NEUTRAL
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { plainToClass } from 'class-transformer';
// import apiPath from 'src/Center/api.path';
// import { EventDto } from './Dto/event.dto';
// import { ExportSendLogDto } from './Dto/export.send.log.dto';
// import {
//   GetMotClusterInfoDto,
//   GetMotClusterInfoResp
// } from './Dto/get.mot.cluster.info.dto';
// import {
//   GetMotClusterListDto,
//   GetMotClusterListResp
// } from './Dto/get.mot.cluster.list.dto';
// import { GetMotCommonSettingResp } from './Dto/get.mot.common.setting.dto';
// import { GetMotSettingInfoResp } from './Dto/get.mot.setting.info.dto';
// import { GetMotSettingListResp } from './Dto/get.mot.setting.list.dto';
// import { GetMotSettingParameterResp } from './Dto/get.mot.setting.parameter.dto';
// import { GetSendLogResp, GetSendLogtDto } from './Dto/get.send.log.dto';
// import { InsertEventDto } from './Dto/insert.event.dto';
// // import { SendTestDto } from './Dto/send.test.dto';
// import { SendTestDto } from './Dto/send.test.dto';
// import { UpdateMotClusterSettingDto } from './Dto/upd.cluster.setting.dto';
// import { UpdateMotClusterContentDto } from './Dto/update.mot.cluster.content.dto';
// import { UpdateMotCommonSettingDto } from './Dto/update.mot.common.setting.dto';
// import { UpdateMotContentSettingDto } from './Dto/update.mot.content.setting.dto';
// import { UpdateMotSettingDto } from './Dto/update.mot.setting.dto';
// import { UpdateMotStateDto } from './Dto/update.mot.state.dto';
// import { MotService } from './mot.service';

// @ApiTags('memberShip')
// @Controller({
//   version: VERSION_NEUTRAL,
//   path: 'mot'
// })
// export class MotController {
//   constructor(private readonly motService: MotService) {}

//   /**
//    * 編輯單次群發建立條件
//    * @returns
//    */
//   @Patch(apiPath.mot.updateMotClusterSetting)
//   @ApiOperation({
//     summary: '新增編輯單次群發建立條件'
//   })
//   @UseInterceptors(FileInterceptor('file'))
//   @ApiCreatedResponse({
//     status: 200,
//     description: '新增編輯單次群發建立條件',
//     type: GetMotClusterInfoDto
//   })
//   async updateMotClusterSetting(
//     @UploadedFile() file: Express.Multer.File,
//     @Headers() headers: any,
//     @Body() data
//   ): Promise<{ clusterId: string }> {
//     const userId = headers?.['authMemberId'];
//     const parsedData = data?.body ? JSON.parse(data?.body) : null;
//     const body = plainToClass(UpdateMotClusterSettingDto, parsedData);

//     const result = await this.motService.updateMotClusterSetting(
//       file,
//       body,
//       userId
//     );

//     return result;
//   }

//   /**
//    * 編輯單次群發發送內容設定
//    * @returns
//    */
//   @Patch(apiPath.mot.updateMotClusterContent)
//   @ApiOperation({
//     summary: '編輯單次群發發送內容設定'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '編輯單次群發發送內容設定',
//     type: Object
//   })
//   async updateMotClusterContent(
//     @Body() body: UpdateMotClusterContentDto
//   ): Promise<Record<string, never>> {
//     const result = await this.motService.updateMotClusterContent(body);

//     return result;
//   }

//   /**
//    * 取得單次群發發送內容資訊
//    * @returns
//    */
//   @Post(apiPath.mot.getMotClusterInfo)
//   @ApiOperation({
//     summary: '取得單次群發發送內容資訊'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '取得單次群發發送內容資訊',
//     type: GetMotClusterInfoResp
//   })
//   async getMotClusterInfo(
//     @Body() body: GetMotClusterInfoDto
//   ): Promise<GetMotClusterInfoResp> {
//     const { clusterId } = body;
//     const result = await this.motService.getMotClusterInfo(clusterId);

//     return result;
//   }

//   /**
//    * 取得單次群發列表
//    * @returns
//    */
//   @Post(apiPath.mot.getMotClusterList)
//   @ApiOperation({
//     summary: '取得單次群發列表'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '取得單次群發列表',
//     type: GetMotClusterListResp
//   })
//   async getMotClusterList(
//     @Body() body: GetMotClusterListDto
//   ): Promise<GetMotClusterListResp> {
//     const result = await this.motService.getMotClusterList(body);

//     return result;
//   }

//   /**
//    * 群發設定測試發送
//    * @returns
//    */
//   @Post(apiPath.mot.clusterSendTest)
//   @ApiOperation({
//     summary: '群發設定測試發送'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '群發設定測試發送',
//     type: Object
//   })
//   async clusterSendTest(
//     @Body() body: GetMotClusterInfoDto
//   ): Promise<Record<string, never>> {
//     const { clusterId } = body;
//     console.log('post clusterSendTest');
//     const result = await this.motService.clusterSendTest(clusterId);

//     return result;
//   }

//   /**
//    * 停用定期群發管理
//    * @returns
//    */
//   @Patch(apiPath.mot.stopMotCluster)
//   @ApiOperation({
//     summary: '停用定期群發管理'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '停用定期群發管理',
//     type: Object
//   })
//   async stopMotCluster(
//     @Body() body: GetMotClusterInfoDto
//   ): Promise<Record<string, never>> {
//     const result = await this.motService.stopMotCluster(body);

//     return result;
//   }

//   /**
//    * 刪除群發管理
//    * @returns
//    */
//   @Delete(apiPath.mot.deleteMotCluster)
//   @ApiOperation({
//     summary: '刪除群發管理'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '刪除群發管理',
//     type: Object
//   })
//   async deleteMotCluster(
//     @Body() body: GetMotClusterInfoDto
//   ): Promise<Record<string, never>> {
//     const result = await this.motService.deleteMotCluster(body);

//     return result;
//   }

//   /**
//    * 取得群發通用設定
//    * @returns
//    */
//   @Get(apiPath.mot.getMotCommonSetting)
//   @ApiOperation({
//     summary: '取得群發通用設定'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '取得群發通用設定',
//     type: GetMotCommonSettingResp
//   })
//   async getMotCommonSetting(): Promise<GetMotCommonSettingResp> {
//     const result = await this.motService.getMotCommonSetting();

//     return result;
//   }

//   /**
//    * 編輯群發通用設定
//    * @returns
//    */
//   @Patch(apiPath.mot.updateMotCommonSetting)
//   @ApiOperation({
//     summary: '編輯群發通用設定'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '編輯群發通用設定',
//     type: Object
//   })
//   async updateMotCommonSetting(
//     @Body() body: UpdateMotCommonSettingDto
//   ): Promise<Record<string, never>> {
//     const result = await this.motService.updateMotCommonSetting(body);

//     return result;
//   }

//   /**
//    * 取得事件設定所需參數
//    * @returns
//    */
//   @Post(apiPath.mot.getMotSettingParameter)
//   @ApiOperation({
//     summary: '取得事件設定所需參數'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '取得事件設定所需參數',
//     type: Object
//   })
//   async getMotSettingParameter(
//     @Body() body: EventDto
//   ): Promise<GetMotSettingParameterResp> {
//     const { event } = body;
//     const result = await this.motService.getMotSettingParameter(event);

//     return result;
//   }

//   /**
//    * 編輯建立條件
//    * @returns
//    */
//   @Patch(apiPath.mot.updateMotSetting)
//   @ApiOperation({
//     summary: '編輯建立條件'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '編輯建立條件',
//     type: Object
//   })
//   async updateMotSetting(
//     @Body() body: UpdateMotSettingDto
//   ): Promise<Record<string, never>> {
//     const result = await this.motService.updateMotSetting(body);

//     return result;
//   }

//   /**
//    * 編輯發送內容設定
//    * @returns
//    */
//   @Patch(apiPath.mot.updateMotContentSetting)
//   @ApiOperation({
//     summary: '編輯發送內容設定'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '編輯發送內容設定',
//     type: Object
//   })
//   async updateMotContentSetting(
//     @Body() body: UpdateMotContentSettingDto
//   ): Promise<Record<string, never>> {
//     const result = await this.motService.updateMotContentSetting(body);

//     return result;
//   }

//   /**
//    * 測試發送
//    * @returns
//    */
//   @Post(apiPath.mot.sendTest)
//   @ApiOperation({
//     summary: '測試發送'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '測試發送',
//     type: Object
//   })
//   async sendTest(@Body() body: SendTestDto): Promise<Record<string, never>> {
//     const result = await this.motService.sendTest(body);

//     return result;
//   }

//   /**
//    * 取得 MOT 設定資訊
//    * @returns
//    */
//   @Post(apiPath.mot.getMotSettingInfo)
//   @ApiOperation({
//     summary: '取得 MOT 設定資訊'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '取得 MOT 設定資訊',
//     type: GetMotSettingInfoResp
//   })
//   async getMotSettingInfo(
//     @Body() body: EventDto
//   ): Promise<GetMotSettingInfoResp> {
//     const { event } = body;
//     const result = await this.motService.getMotSettingInfo(event);

//     return result;
//   }

//   /**
//    * 取得 MOT 設定列表
//    * @returns
//    */
//   @Get(apiPath.mot.getMotSettingList)
//   @ApiOperation({
//     summary: '取得 MOT 設定列表'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '取得 MOT 設定列表',
//     type: GetMotSettingListResp
//   })
//   async getMotSettingList(): Promise<GetMotSettingListResp> {
//     const result = await this.motService.getMotSettingList();

//     return result;
//   }

//   /**
//    * 啟用/停用 MOT 事件
//    * @returns
//    */
//   @Patch(apiPath.mot.updateMotState)
//   @ApiOperation({
//     summary: '啟用/停用 MOT 事件'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '啟用/停用 MOT 事件',
//     type: Object
//   })
//   async updateMotState(
//     @Body() body: UpdateMotStateDto
//   ): Promise<Record<string, never>> {
//     const result = await this.motService.updateMotState(body);

//     return result;
//   }

//   /**
//    * 取得群發紀錄
//    * @returns
//    */
//   @Post(apiPath.mot.getSendLog)
//   @ApiOperation({
//     summary: '取得群發紀錄'
//   })
//   @ApiCreatedResponse({
//     status: 200,
//     description: '取得群發紀錄',
//     type: GetSendLogResp
//   })
//   async getSendLog(@Body() body: GetSendLogtDto): Promise<GetSendLogResp> {
//     const result = await this.motService.getSendLog(body);

//     return result;
//   }

//   /**
//    * 匯出單筆群發紀錄
//    * @param body
//    * @returns
//    */
//   @Post(apiPath.mot.exportSendLog)
//   @ApiOperation({
//     summary: '匯出單筆群發紀錄'
//   })
//   async exportSendLog(@Body() body: ExportSendLogDto) {
//     await this.motService.exportSendLog(body);

//     return {};
//   }

//   /**
//    * 新增事件(OAuth)
//    * @param body
//    * @returns
//    */
//   @Post(apiPath.mot.insertEvent)
//   @ApiOperation({
//     summary: '新增事件'
//   })
//   async insertEvent(
//     @Body() body: InsertEventDto
//   ): Promise<Record<string, never>> {
//     await this.motService.insertEvent(body);

//     return {};
//   }

//   /**
//    * 偵測 email 是否有被打開
//    * @param req
//    * @returns
//    */
//   @Get(apiPath.mot.mailTrack)
//   @ApiOperation({
//     summary: '偵測 email 是否有被打開'
//   })
//   async mailTrack(@Req() req): Promise<Record<string, never>> {
//     // 因 gmail 會自動渲染，造成信件直接被已讀，所以 user agent 若同時含有三種的話直接略過
//     const ua = req.get('User-Agent') || req.headers['user-agent'];
//     if (
//       (ua?.includes('Chrome') &&
//         ua?.includes('Safari') &&
//         ua?.includes('Edge')) ||
//       ua?.includes('Postman')
//     ) {
//       return {};
//     }

//     await this.motService.mailTrack(req?.query);

//     return {};
//   }

//   // @Get('/reportTest')
//   // async reportTest() {
//   //   await this.motService.reportTest();

//   //   return {};
//   // }

//   // @Get('/pointTest')
//   // async pointTest() {
//   //   await this.motService.pointTest();

//   //   return {};
//   // }

//   // @Get('/couponTest')
//   // async couponTest() {
//   //   await this.motService.couponTest();

//   //   return {};
//   // }

//   // @Get('/memberInfoTest')
//   // async memberInfoTest() {
//   //   await this.motService.memberInfoTest();

//   //   return {};
//   // }
// }

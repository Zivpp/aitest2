export interface GetSendContentResp {
  smsContent: string;
  appPushTitle: string;
  appPushContent: string;
  msgImg: string;
  msgSource: number;
  msgUrl: string;
  msgType: number;
  emailTitle: string;
  emailContent: string;
  fullEmailContent: string;
  app: number;
  sms: number;
  email: number;
}

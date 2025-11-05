export interface GetClusterSendContentResp {
    clusterId: string;
    mobile: string;
    email: string;
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
    sendMethod: string[];
}
export interface GetClusterSendContentWithCardIdResp {
    memberCardId: string;
    clusterId: string;
    mobile: string;
    email: string;
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
    sendMethod: string[];
}

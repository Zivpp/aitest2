export interface GetSendLogResp {
  logCount: LogCount[];
  logList: LogList[];
}

export interface LogCount {
  count: number;
}

export interface LogList {
  event: string;
  eventName: string;
  eventDescription: string;
  sendDate: string;
  sendMethod: string[];
  expectedCount: number[];
  realCount: number[];
  openCount: number[];
  sendTime: string;
  createDate: string;
  createName: string;
  alterDate: string;
  alterName: string;
}

export interface GetMotClusterListInfoResp {
  clusterCount: ClusterCount[];
  clusterList: ClusterList[];
  startTime: StartTime;
}

export interface ClusterCount {
  clusterCount: number;
}

export interface ClusterList {
  clusterId: string;
  clusterName: string;
  clusterDescription: string;
  startDate: string;
  endDate: string;
  sendStatus: string;
  sendMethodInfo: SendMethodInfo[];
  createTime: string;
  createName: string;
  alterTime: string;
  alterName: string;
}

export interface SendMethodInfo {
  peopleCount: number;
  sendMethod: string;
}

export interface StartTime {
  startTime: string;
}

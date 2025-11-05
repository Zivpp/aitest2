export interface ELKLogObj {
    method: string;
    route: string;
    sourceIP: string;
    userAgent: string;
    level: string;
    msg: string;
    status: number;
    code: number;
    token: string;
    time: string;
    request: any;
    response: string;
    timing: string;
    service: string;
    emailTo: string;
    emailContent: string;
    sourceType: string;
    exectime: number;
    headers: string;
}

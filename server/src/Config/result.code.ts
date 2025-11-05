"use strict";
export const SUCCESS = 1;
export const FAILED = 0;

export const rc_msg = {
  "-": {
    0: "failed",
    1: "success",
    100: "파라미터가 부족합니다",
    101: "opkey 길이가 잘못되었습니다.",
    102: "잘못된 URL입니다.",
    4001: "존재하지 않는 오퍼레이터입니다",
    4002: "사용이 제한된 오퍼레이터입니다.",
    4003: "승인 대기중인 오퍼레이터입니다.",
    4010: "등록되지 않은 IP입니다.",
    4101: "존재하지 않는 게임입니다.",
    4102: "이용이 제한된 게임입니다.",
    4103: "사용이 불가능한 상태입니다.",
    4104: "사용하지 않는 게임입니다.",

    5001: "오퍼레이터 자금이 부족합니다.",

    10000: "검증오류, hash데이터가 일치하지 않습니다.",
    10001: "존재하지 않는 회원입니다",
    10002: "회원생성실패",

    20000: "게임사 게임링크 정보 수신에 상태이상 발생",
    20001: "게임사 게임링크 정보 수신에 오류가 발생",

    20100: "JSON 파서 오류",
    20101: "수신데이터 오류",
    20110: "원격서버오류",
    20111: "원격서버 타임아웃",

    20200: "존재하지 않는 라운드",
    20201: "이미 등록된 거래",
    20202: "이미 완료된 거래",
    20203: "이미 완료된 환불",
    20204: "취소된 라운드",
    20205: "베팅 실패 후 재요청",
    20206: "이미 종료된 라운드",
    20207: "이미 완료된 팁",

    21000: "reponse statuscode error",
    21001: "오퍼레이터 정보에 회원확인 콜백주소가 없습니다.",
    21003: "오퍼레이터 정보에 배팅 콜백주소가 없습니다.",
    21004: "오퍼레이터에 할당된 게임이 아닙니다.",

    21009: "오퍼레이터 원격서버 응답 결과값 오류",
    21010: "오퍼레이터에 존재하지않는 회원",
    21011: "오퍼레이터 회원 잔액부족",
    21012: "오퍼레이터 회원 차단중",

    201: "잔액부족",

    999: "알수없는오류",
  },
  "-eng": {
    0: "failed",
    1: "success",
    100: "파라미터가 부족합니다",
    101: "opkey 길이가 잘못되었습니다.",
    102: "잘못된 URL입니다.",
    4001: "존재하지 않는 오퍼레이터입니다",
    4002: "사용이 제한된 오퍼레이터입니다.",
    4003: "승인 대기중인 오퍼레이터입니다.",
    4010: "등록되지 않은 IP입니다.",
    4101: "존재하지 않는 게임입니다.",
    4102: "이용이 제한된 게임입니다.",
    4103: "사용이 불가능한 상태입니다.",
    4104: "사용하지 않는 게임입니다.",

    5001: "Operator funds are low.",

    10000: "검증오류, hash데이터가 일치하지 않습니다.",
    10001: "존재하지 않는 회원입니다",
    10002: "회원생성실패",

    20000: "게임사 게임링크 정보 수신에 상태이상 발생",
    20001: "게임사 게임링크 정보 수신에 오류가 발생",

    20100: "JSON 파서 오류",
    20101: "수신데이터 오류",
    20110: "원격서버오류",
    20111: "원격서버 타임아웃",

    20200: "존재하지 않는 베팅",
    20201: "이미 등록된 베팅",
    20202: "이미 완료된 거래",
    20203: "이미 완료된 환불",
    20204: "취소된 라운드",
    20205: "베팅 실패 후 재요청",
    20206: "이미 종료된 라운드",

    21000: "reponse statuscode error",
    21001: "오퍼레이터 정보에 회원확인 콜백주소가 없습니다.",
    21003: "오퍼레이터 정보에 배팅 콜백주소가 없습니다.",

    21009: "오퍼레이터 원격서버 응답 결과값 오류",
    21010: "오퍼레이터에 존재하지않는 회원",
    21011: "오퍼레이터 회원 잔액부족",
    21012: "오퍼레이터 회원 차단중",

    201: "잔액부족",

    999: "알수없는오류",
  },
  transfer: {
    0: "failed",
    1: "success",

    10: "존재하지 않는 유저",
    11: "잔액이 부족합니다.",

    50: "파라미터가 잘못되었습니다.",
    100: "파라미터가 부족합니다",
    999: "알수없는오류",
  },
};

/**
 *
 * @param a_type
 * @param a_code
 * @returns
 */
export function getResultMsg(a_type: string, a_code: number) {
  let objMsg = rc_msg[a_type],
    strMsg: string | null = null;

  if (objMsg) strMsg = rc_msg[a_type][a_code];

  if (typeof strMsg == "undefined") strMsg = "실패했습니다";

  return strMsg;
}

// module.exports.SUCCESS = SUCCESS;
// module.exports.FAILED = FAILED;
// module.exports.getResultMsg = getResultMsg;

/*
100 Continue
101 Switching Protocols
103 Early Hints
200 OK
201 Created
202 Accepted
203 Non-Authoritative Information
204 No Content
205 Reset Content
206 Partial Content
300 Multiple Choices
301 Moved Permanently
302 Found
303 See Other
304 Not Modified
307 Temporary Redirect
308 Permanent Redirect
400 Bad Request
401 Unauthorized
402 Payment Required
403 Forbidden
404 Not Found
405 Method Not Allowed
406 Not Acceptable
407 Proxy Authentication Required
408 Request Timeout
409 Conflict
410 Gone
411 Length Required
412 Precondition Failed
413 Payload Too Large
414 URI Too Long
415 Unsupported Media Type
416 Range Not Satisfiable
417 Expectation Failed
418 I'm a teapot
422 Unprocessable Entity
425 Too Early
426 Upgrade Required
428 Precondition Required
429 Too Many Requests
431 Request Header Fields Too Large
451 Unavailable For Legal Reasons
500 Internal Server Error
501 Not Implemented
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
505 HTTP Version Not Supported
506 Variant Also Negotiates
507 Insufficient Storage
508 Loop Detected
510 Not Extended
511 Network Authentication Required
*/

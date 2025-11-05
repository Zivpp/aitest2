"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpcPrefix = "/grpc";
const grpc = {
    game: {
        clientCallingTest: grpcPrefix + "/clientCallingTest",
    },
};
const mainApp = {
    getIp: "/ip",
    hash: "/hash",
    account: "/account",
    create_account: "/create_account",
    provlist: "/provlist",
    gamelist: "/gamelist",
    play: "/play",
    Game: {
        tablelist: "/game/tablelist",
    },
    current: {
        r: "/current/r",
    },
    hotgames: {
        top30: "/hotgames/top30",
    },
    log: {
        get: "/log/get",
    },
    v2: {
        getIp: "/ip",
        hash: "/hash",
        account: "/account",
        create_account: "/create_account",
        provlist: "/provlist",
        gamelist: "/gamelist",
        gamelist_new: "/gamelist_new",
        play: "/play",
        Game: {
            tablelist: "/game/tablelist",
        },
        current: {
            r: "/current/r",
        },
        hotgames: {
            top30: "/hotgames/top30",
        },
        log: {
            get: "/log/get",
        },
    },
};
const pp = {
    session: "/session",
    auth: "/Auth",
    balance: "/Balance",
    bet: "/Bet",
    result: "/Result",
    refund: "/Refund",
    bonusWin: "/BonusWin",
    jackpotWin: "/JackpotWin",
    promoWin: "/PromoWin",
    endround: "/Endround",
};
const bng = {
    session: "/session",
    sid: "/sid",
};
const evolution = {
    getConfig: "/getConfig",
    session: "/session",
    check: "/check",
    balance: "/balance",
    debit: "/debit",
    credit: "/credit",
    cancel: "/cancel",
    promoPayout: "/promo_payout",
    sid: "/sid",
};
const play = {
    play: "/play",
};
const fastpain = {
    routerCenter: "/",
    getHash: "/getHash",
    sid: "/sid",
    session: "/session",
    getBalance: "/getBalance",
    transfer: "/transfer",
    getAcctInfo: "/getAcctInfo",
    deposit: "/deposit",
};
const qqpk = {
    makeSign: "/makeSign",
    sid: "/sid",
    session: "/session",
    balance: "/balance",
    debit: "/debit",
    credit: "/credit",
};
const clp = {
    session: "session",
    api: {
        seamless: {
            getBalance: "api/seamless/getBalance",
            bet: "api/seamless/bet",
            settlement: "api/seamless/settlement",
            cancel: "api/seamless/cancel",
        },
    },
};
const hrg = {
    session: "session",
    get_balance: "get_balance",
    place_bet: "place_bet",
    cancel_bet: "cancel_bet",
    settle: "settle",
    event_settle: "event_settle",
};
exports.default = {
    mainApp,
    grpc,
    evolution,
    pp,
    bng,
    play,
    fastpain,
    qqpk,
    clp,
    hrg,
};
//# sourceMappingURL=api.path.js.map
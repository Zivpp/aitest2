"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAppDao = void 0;
const common_1 = require("@nestjs/common");
const mysql_base_dao_1 = require("../../Infrastructure/MySQL/mysql.base.dao");
const config_1 = require("../../Config/config");
const result_code_1 = require("../../Config/result.code");
let MainAppDao = class MainAppDao extends mysql_base_dao_1.MysqlBaseDao {
    async getUserByOpIdAndUserIdOrg(opId, userIdOrg) {
        if (!opId || !userIdOrg) {
            return null;
        }
        const sql = `   
            SELECT 
                user_key, user_id, user_id_org, user_name, user_nick, user_nick_org, op_id, cash
            FROM cx_user
            WHERE op_id = ?
            AND user_id_org = ?
            `;
        const params = [opId, userIdOrg];
        const rows = await this.query(sql, params);
        return rows[0] ?? null;
    }
    async insertUser(dataObj) {
        const sql = `
            INSERT INTO cx_user (
                user_key, user_id, user_id_org, user_name,
                user_nick, user_nick_org, op_id
            ) VALUES (
                NULL, ?, ?, ?, ?, ?, ?
            )
            `;
        const params = [
            dataObj.user_id,
            dataObj.user_id_org,
            dataObj.user_name,
            dataObj.user_nick,
            dataObj.user_nick_org,
            dataObj.op_id,
        ];
        const result = await this.query(sql, params);
        return result;
    }
    async getOperatorInfo(opkey, ip) {
        if (process.env.APP_ENV === "local") {
            ip = config_1.Config.VPN_IP;
        }
        console.info("[getOperatorInfo][opkey] = ", opkey);
        console.info("[getOperatorInfo][ip] = ", ip);
        const sql = "CALL proc_chk_operator(?, ?, @result)";
        const [result] = await this.pool.query(sql, [opkey, ip]);
        if (!result || !result[0][0]?._RESULT || result[0][0]?._RESULT !== 1) {
            return null;
        }
        const resultOb = result[0][0];
        const operator = {};
        operator.idx = resultOb.OPERATOR_ID ?? 0;
        operator.nickname = resultOb.OPERATOR_NAME ?? "";
        operator.uuid = opkey;
        operator.wallet_type = resultOb.WALLET_TYPE ?? "";
        operator.qt_level = resultOb.QT_LEVEL ?? null;
        operator.use_splash = resultOb.USE_SPLASH ?? 0;
        return operator;
    }
    async updateUserIdByKey(tableName, updateObj, conditionStr, whereObj) {
        return this.inTx(async (conn) => {
            return this.updateByObject(tableName, updateObj, conditionStr, whereObj, {
                conn,
            });
        });
    }
    async getCPList(a_bUseViewUrl = false) {
        const result = [];
        const sql = `
            SELECT 
                gcp_key, gcp_name, game_type, result_url, use_splash
            FROM  cx_game_cp
            WHERE  is_use = 1
            ORDER BY gcp_key;
        `;
        const rows = await this.query(sql);
        if (rows && rows.length > 0) {
            for (const row of rows) {
                const item = {
                    code: row.gcp_key,
                    name: row.gcp_name,
                    type: row.game_type,
                };
                if (a_bUseViewUrl) {
                    item.view_url = row.result_url;
                    item.use_splash = row.use_splash;
                }
                result.push(item);
            }
        }
        return result;
    }
    async getGameList(cpkey, version) {
        const sqlHot = `
            SELECT game_code, pos
            FROM cx_game_cp_hot_list
            WHERE game_cp_key = ?
            `;
        const sqlGame = `
            SELECT
                game_code,
                game_id,
                game_name_eng,
                game_name_kor,
                game_type,
                table_type,
                is_lobby + 0  AS is_lobby,
                is_desktop + 0 AS is_desktop,
                is_mobile + 0  AS is_mobile,
                img_1,
                game_reg_date
            FROM cx_game
            WHERE game_cp_key = ? AND is_use = 1
            ORDER BY pos
            `;
        const [[hotRows], [gameRows]] = await Promise.all([
            this.query(sqlHot, [cpkey]),
            this.query(sqlGame, [cpkey]),
        ]);
        console.log(`hotRows >>>`, hotRows);
        console.log(`gameRows >>>`, gameRows);
        if (!hotRows || !gameRows) {
            throw new Error(!hotRows
                ? "getGameList: hotRows is null or undefined"
                : "getGameList: gameRows is null or undefined");
        }
        const hotMap = new Map();
        for (const h of hotRows ?? []) {
            hotMap.set(h.game_code, h.pos);
        }
        const list = [];
        for (const r of gameRows ?? []) {
            const base = {
                code: r.game_code,
                id: r.game_id,
                type: r.game_type,
                is_lobby: !!r.is_lobby,
                is_desktop: !!r.is_desktop,
                is_mobile: !!r.is_mobile,
                date: r.game_reg_date,
                table: r.game_type === config_1.Config.GAMECODE.LIVE
                    ? { type: r.table_type ?? "", is_lobby: !!r.is_lobby }
                    : null,
            };
            if (version === 2) {
                const item = {
                    ...base,
                    name: { eng: r.game_name_eng, kor: r.game_name_kor },
                    thumbnail: { default: r.img_1 ?? "" },
                };
                list.push(item);
            }
            else {
                const item = {
                    ...base,
                    name_eng: r.game_name_eng,
                    name_kor: r.game_name_kor,
                    img_1: r.img_1 ?? "",
                };
                list.push(item);
            }
        }
        const hotSparse = [];
        for (const g of list) {
            const pos = hotMap.get(g.code);
            if (typeof pos === "number") {
                hotSparse[pos] = g;
            }
        }
        const hot = hotSparse.filter(Boolean);
        return { list, hot };
    }
    async getTblOperatorByUuid(uuid) {
        const sql = `
            SELECT 
                idx, uuid, wallet_type, qt_level, use_splash
            FROM tbl_operator
            WHERE uuid = ?
            `;
        const params = [uuid];
        const rows = await this.query(sql, params);
        if (!rows || rows.length === 0) {
            return null;
        }
        const rowData = rows[0];
        const result = {};
        result._RESULT = result_code_1.SUCCESS;
        result.id = rowData.idx;
        result.key = rowData.uuid;
        result.wallet_type = rowData.wallet_type;
        result.qt_level = rowData.qt_level;
        result.use_splash = rowData.use_splash;
        return result;
    }
    async procChkOperator(opkey, ip) {
        const sql = "CALL proc_chk_operator(?, ?, @result)";
        const params = [opkey, ip];
        const rows = await this.query(sql, params);
        const resPCO = rows[0][0]?._RESULT === 1 ? rows[0][0] : null;
        const result = {};
        if (resPCO) {
            result._RESULT = resPCO._RESULT || 0;
            result.id = resPCO.OPERATOR_ID || 0;
            result.name = resPCO.OPERATOR_NAME || "";
            result.key = opkey;
            result.wallet_type = resPCO.WALLET_TYPE || "";
            result.qt_level = resPCO.QT_LEVEL || 0;
            result.use_splash = resPCO.USE_SPLASH || 0;
        }
        else {
            return null;
        }
        return result;
    }
    async callProcChkOperator(opkey, ip) {
        const sql = "CALL proc_chk_operator(?, ?, @result)";
        const params = [opkey, ip];
        const rows = await this.query(sql, params);
        const result = rows[0][0]?._RESULT === 1 ? rows[0][0] : null;
        return result;
    }
    async getGameMTCode(strThirdPartyCode, strGameCode) {
        const sql = `
            SELECT 
                game_mt_code 
            FROM cx_game_mt 
            WHERE 
                game_cp_key=? AND game_code=?`;
        const params = [strThirdPartyCode, strGameCode];
        const rows = await this.query(sql, params);
        if (!rows || rows.length === 0 || !rows[0]?.game_mt_code) {
            return null;
        }
        return rows[0].game_mt_code;
    }
    async checkGamePermit(a_nOPID, a_nGameCPKey, a_strGameCode) {
        const sql = `CALL proc_chk_game(?,?,?,@result)`;
        const params = [a_nOPID, a_nGameCPKey, a_strGameCode];
        const rows = await this.query(sql, params);
        const nResult = parseInt(rows[0][0]?._RESULT);
        return nResult;
    }
    async getOperatorTree(oId) {
        const sql = `
            SELECT parent_operator_tree 
            FROM tbl_operator 
            WHERE idx=?
        `;
        const params = [oId];
        const rows = await this.query(sql, params);
        if (!rows || rows.length === 0 || !rows[0]?.parent_operator_tree) {
            return null;
        }
        return rows[0].parent_operator_tree;
    }
    async getOperatorSplashInfo(aTree) {
        const aFilter = aTree.map((item) => `'${item}'`);
        const sql = [
            "SELECT operator_id AS op_name, use_splash FROM tbl_operator WHERE operator_id IN(",
            aFilter.join(","),
            ")",
        ].join("");
        const rows = await this.query(sql);
        return rows;
    }
    async getOperatorSplashList_name(name) {
        const sql = `
            SELECT 
                splash_name,splash_url,css_bg_color,css_img_size 
            FROM tbl_operator_splash 
            WHERE operator_id=? and is_use=1 
            ORDER BY pos LIMIT 1
        `;
        const params = [name];
        const rows = await this.query(sql, params);
        if (!rows || rows.length === 0) {
            return null;
        }
        return rows[0];
    }
    async getOpratorGameInfo(oId) {
        const sql = `
            SELECT 
                operator_uuid, wallet_type, _o.operator_id, callback_member, 
                callback_balance, callback_bet, callback_result, callback_cancel, 
                callback_tip 
            FROM tbl_operator_config AS _oc 
                INNER JOIN tbl_operator AS _o ON _oc.operator_id=_o.operator_id 
            WHERE _o.idx=?
        `;
        const params = [oId];
        const rows = await this.query(sql, params);
        if (!rows || rows.length === 0) {
            return null;
        }
        const rowData = rows[0];
        const result = {
            op_id: rowData.operator_id,
            op_key: rowData.operator_uuid,
            load_time: Date.now(),
            wallet: rowData.wallet_type,
            urls: {
                member_check: rowData.callback_member,
                balance: rowData.callback_balance,
                bet: rowData.callback_bet,
                result: rowData.callback_result,
                cancel: rowData.callback_cancel,
                tip: rowData.callback_tip,
                etc: rowData.callback_etc,
            },
        };
        return result;
    }
    async getR(opId) {
        const sql = `
            SELECT cash 
            FROM tbl_operator 
            WHERE idx=?
        `;
        const params = [opId];
        const rows = await this.query(sql, params);
        if (!rows || rows.length === 0) {
            return null;
        }
        return rows[0].cash;
    }
    async getBetLog(opkey, roundId) {
        const sql = [
            `SELECT 
                user_key, third_party_code, game_code,
                third_party_round_id, third_party_trans_id, times 
            FROM bet_`,
            opkey,
            "WHERE round_id=",
            roundId,
            " LIMIT 1",
        ].join("");
        const params = [opkey, roundId];
        const rows = await this.query(sql, params);
        if (!rows || rows.length === 0) {
            return null;
        }
        return rows[0];
    }
    async getNewGameList() {
        const sql = `
            SELECT 
                game_id, game_code, game_name_eng, game_name_kor, game_type, is_desktop+0 AS is_desktop,
                is_mobile+0 AS is_mobile, img_1, game_reg_date
            FROM cx_game_new
            ORDER BY game_cp_key
        `;
        const rows = await this.query(sql);
        if (!rows || rows.length === 0) {
            return null;
        }
        return rows;
    }
};
exports.MainAppDao = MainAppDao;
exports.MainAppDao = MainAppDao = __decorate([
    (0, common_1.Injectable)()
], MainAppDao);
//# sourceMappingURL=main.app.dao.js.map
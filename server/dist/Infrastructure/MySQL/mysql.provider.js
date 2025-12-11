"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlPoolProvider = void 0;
const mysql_token_1 = require("./mysql.token");
exports.MysqlPoolProvider = {
    provide: mysql_token_1.DB_POOL,
    useFactory: async () => {
        try {
            return;
        }
        catch (error) {
            console.error("Error creating MySQL pool:", error);
            throw error;
        }
    },
};
//# sourceMappingURL=mysql.provider.js.map
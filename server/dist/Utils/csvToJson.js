"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const csv = require("csv-parser");
async function csvToJson(csvFilePath, needVerify = false) {
    try {
        const jsonArray = [];
        const getCsvPromise = async (csvFilePath) => new Promise((res, rej) => {
            try {
                fs.createReadStream(csvFilePath)
                    .pipe(csv())
                    .on("data", (row) => {
                    if (needVerify) {
                        const isEmptyRow = Object.values(row).some((value) => value === undefined || value === null || value === "");
                        if (isEmptyRow) {
                            rej(`欄位內容不能為空`);
                        }
                    }
                    jsonArray.push(row);
                })
                    .on("end", () => {
                    res(jsonArray);
                });
            }
            catch (error) {
                rej(error);
            }
        });
        const result = await getCsvPromise(csvFilePath);
        return result;
    }
    catch (error) {
        throw error;
    }
}
exports.default = csvToJson;
//# sourceMappingURL=csvToJson.js.map
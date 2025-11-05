const fs = require("fs");
const csv = require("csv-parser");

/**
 * csv 轉成 Array 形式
 * @param csvFilePath
 * @param needVerify 是否需檢核 csv
 * @returns
 */
async function csvToJson(csvFilePath: string, needVerify = false) {
  try {
    const jsonArray: any[] = [];
    // 讀取 CSV 檔案
    const getCsvPromise = async (csvFilePath) =>
      new Promise((res, rej) => {
        try {
          fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on("data", (row) => {
              if (needVerify) {
                // 檢查每個欄位是否有內容
                const isEmptyRow = Object.values(row).some(
                  (value) =>
                    value === undefined || value === null || value === "",
                );
                if (isEmptyRow) {
                  rej(`欄位內容不能為空`);
                }
              }
              jsonArray.push(row);
            })
            .on("end", () => {
              res(jsonArray);
            });
        } catch (error) {
          rej(error);
        }
      });

    const result = await getCsvPromise(csvFilePath);
    return result;
  } catch (error) {
    throw error;
  }
}

export default csvToJson;

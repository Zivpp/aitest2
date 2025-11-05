import * as fs from "fs";

/** 產生 csv 檔 */
function generateCsv<T>(CsvGenerateConfig: CsvGenerateConfig<T>) {
  const { rowConfig, data, fileName, dir } = CsvGenerateConfig;
  const configLength = rowConfig.length;
  const header = rowConfig.reduce((acc, crr, index) => {
    if (index !== 0) acc += ",";
    acc += `${crr.title}`;
    if (index === configLength - 1) acc += "\n";
    return acc;
  }, "");
  const content = data.reduce((accStr, rowData) => {
    const rowStr = rowConfig.reduce((acc, crr, index) => {
      if (index !== 0) acc += ",";
      if (crr.render) {
        acc += `${crr.render(rowData, index)}`;
      } else {
        acc += `${rowData[crr.key]}`;
      }
      if (index === configLength - 1) acc += "\n";
      return acc;
    }, "");
    accStr += rowStr;
    return accStr;
  }, "");

  const csvStr = header + content;

  // 指定位置
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  // 生成檔案
  fs.writeFileSync(`${dir}/${fileName}`, `\ufeff${csvStr}`, "utf8");
}

export interface CsvGenerateConfig<T> {
  /** csv 欄位配置 */
  rowConfig: Array<{
    /** 資料對應 key */
    key: string;
    /** csv 欄位名稱 */
    title: string;
    /** 自定義欄位呈現的值 */
    render?: (data: T, index: number) => string | number;
  }>;
  data: Array<T>;
  /** 產生檔名 .csv 結尾 */
  fileName: string;
  /** 本機存放位置 (資料夾路徑) */
  dir: string;
}

export default generateCsv;

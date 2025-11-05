import * as ExcelJS from "exceljs";
import * as fs from "fs";

export class ConvertExcel {
  /**
   * 訂單記錄資料生成 Excel
   *
   * @param fileName
   * @param folderPath
   * @param filesPath
   */
  async orderListToExcel(
    rows,
    fileName: string,
    folderPath: string,
    filesPath: string,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("訂單資料");
    // 定義表頭
    worksheet.columns = [
      { header: "訂單來源", key: "channel", width: 15 },
      { header: "消費品牌", key: "brand", width: 15 },
      { header: "消費門市", key: "store", width: 15 },
      { header: "類型", key: "type", width: 15 },
      { header: "會員卡號", key: "cardId", width: 15 },
      { header: "會員姓名", key: "name", width: 15 },
      { header: "手機國碼", key: "countryCode", width: 15 },
      { header: "手機號碼", key: "mobile", width: 15 },
      { header: "交易時間", key: "transactionTime", width: 25 },
      { header: "交易序號", key: "transactionCode", width: 15 },
      { header: "發票號碼", key: "invoiceNumber", width: 15 },
      { header: "折扣內容", key: "content", width: 15 },
      {
        header: "折抵點數",
        key: "point",
        width: 15,
        style: { numFmt: "#,##0" },
      },
      {
        header: "原始金額",
        key: "amount",
        width: 15,
        style: { numFmt: "#,##0" },
      },
      {
        header: "折扣金額",
        key: "rebateAmount",
        width: 15,
        style: { numFmt: "#,##0" },
      },
      { header: "運費", key: "fare", width: 15, style: { numFmt: "#,##0" } },
      {
        header: "實付金額",
        key: "actualAmount",
        width: 15,
        style: { numFmt: "#,##0" },
      },
    ];

    // 凍結第一列
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 1,
      },
    ];

    // 第一列儲存格
    const fgColorCells = [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
      "L1",
      "M1",
      "N1",
      "O1",
      "P1",
      "Q1",
    ];
    // 定義 儲存格格式
    fgColorCells.forEach((cell) => {
      worksheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "f2f2f2" },
      };
    });

    worksheet.addRows(rows);

    const buffer = await workbook.xlsx.writeBuffer();

    // Convert buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // 指定位置
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    if (!fs.existsSync(filesPath)) fs.mkdirSync(filesPath);
    // 生成檔案
    fs.writeFileSync(`${filesPath}/${fileName}`, uint8Array, "utf8");
  }

  /**
   * 會員列表生成 Excel
   *
   * @param fileName
   * @param folderPath
   * @param filesPath
   */
  async memberListToExcel(
    rows,
    fileName: string,
    folderPath: string,
    filesPath: string,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("訂單資料");

    // 定義表頭
    worksheet.columns = [
      { header: "會員卡號", key: "cardId", width: 15 },
      { header: "會員姓名", key: "name", width: 15 },
      { header: "手機國碼", key: "countryCode", width: 15 },
      { header: "手機號碼", key: "mobile", width: 15 },
      { header: "生日", key: "birthday", width: 15 },
      { header: "性別", key: "gender", width: 10 },
      { header: "Email", key: "email", width: 25 },
      { header: "會籍", key: "memberShip", width: 15 },
      { header: "特殊會員類型", key: "memberSpecialType", width: 15 },
      { header: "註冊日期", key: "createTime", width: 25 },
      { header: "註冊渠道", key: "channel", width: 15 },
    ];

    // 凍結第一列
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 1,
      },
    ];

    // 第一列儲存格
    const fgColorCells = [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
    ];
    // 定義 儲存格格式
    fgColorCells.forEach((cell) => {
      worksheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "f2f2f2" },
      };
    });

    worksheet.addRows(rows);

    const buffer = await workbook.xlsx.writeBuffer();

    // Convert buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // 指定位置
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    if (!fs.existsSync(filesPath)) fs.mkdirSync(filesPath);
    // 生成檔案
    fs.writeFileSync(`${filesPath}/${fileName}`, uint8Array, "utf8");
  }

  /**
   * 兌換券明細生成 Excel
   *
   * @param rows
   * @param fileName
   * @param couponTypeStr
   * @param folderPath
   * @param filesPath
   */
  async couponDetailListToExcel(
    rows,
    fileName: string,
    couponTypeStr: string,
    folderPath: string,
    filesPath: string,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${couponTypeStr}明細`);
    // 定義表頭
    worksheet.columns = [
      { header: "核銷渠道", key: "channel", width: 15 },
      { header: "發放規則", key: "rewardRule", width: 15 },
      { header: "品牌", key: "brand", width: 15 },
      { header: `${couponTypeStr}名稱`, key: "couponType", width: 15 },
      { header: "狀態", key: "status", width: 15 },
      {
        header: "兌換積點",
        key: "point",
        width: 15,
        style: { numFmt: "#,##0" },
      },
      {
        header: "兌換集點",
        key: "reward",
        width: 15,
        style: { numFmt: "#,##0" },
      },
      { header: "會員卡號", key: "cardId", width: 15 },
      { header: "會員姓名", key: "memberName", width: 25 },
      { header: "手機國碼", key: "mobileCountryCode", width: 15 },
      { header: "手機號碼", key: "mobile", width: 15 },
      { header: "交易日", key: "transactionDate", width: 20 },
      { header: "到期日", key: "couponEndDate", width: 20 },
      { header: "核銷日", key: "writeOffDate", width: 20 },
      { header: "轉贈日", key: "transferDate", width: 20 },
      { header: "退貨日", key: "returnDate", width: 20 },
      { header: "核銷門市", key: "writeoffStoreId", width: 15 },
      { header: "交易序號", key: "transactionId", width: 15 },
      { header: "受贈會員", key: "transferCardId", width: 15 },
    ];

    // 凍結第一列
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 1,
      },
    ];

    // 第一列儲存格
    const fgColorCells = [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
      "L1",
      "M1",
      "N1",
      "O1",
      "P1",
      "Q1",
      "R1",
      "S1",
    ];
    // 定義 儲存格格式
    fgColorCells.forEach((cell) => {
      worksheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "f2f2f2" },
      };
    });

    worksheet.addRows(rows);

    const buffer = await workbook.xlsx.writeBuffer();

    // Convert buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // 指定位置
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    if (!fs.existsSync(filesPath)) fs.mkdirSync(filesPath);
    // 生成檔案
    fs.writeFileSync(`${filesPath}/${fileName}`, uint8Array, "utf8");
  }

  /**
   * 集點卡明細生成 Excel
   *
   * @param rows
   * @param fileName
   * @param folderPath
   * @param filesPath
   */
  async rewardDetailToExcel(
    rows,
    fileName: string,
    folderPath: string,
    filesPath: string,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("集點卡明細");
    // 定義表頭
    worksheet.columns = [
      { header: "品牌", key: "brand", width: 15 },
      { header: "集點卡", key: "rewardCard", width: 25 },
      { header: "狀態", key: "status", width: 15 },
      { header: "項目", key: "type", width: 15 },
      { header: "點數", key: "point", width: 15 },
      { header: "累計/滿點點數", key: "pointData", width: 15 },
      { header: "會員卡號", key: "cardId", width: 15 },
      { header: "會員姓名", key: "memberName", width: 25 },
      { header: "手機國碼", key: "mobileCountryCode", width: 15 },
      { header: "手機號碼", key: "mobile", width: 15 },
      { header: "發卡日", key: "sendCardDate", width: 20 },
      { header: "異動日", key: "alterDate", width: 20 },
      { header: "到期日", key: "expirationDate", width: 20 },
      { header: "交易序號", key: "transactionId", width: 15 },
    ];

    // 凍結第一列
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 1,
      },
    ];

    // 第一列儲存格
    const fgColorCells = [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
      "L1",
      "M1",
      "N1",
    ];
    // 定義 儲存格格式
    fgColorCells.forEach((cell) => {
      worksheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "f2f2f2" },
      };
    });

    worksheet.addRows(rows);

    const buffer = await workbook.xlsx.writeBuffer();

    // Convert buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // 指定位置
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    if (!fs.existsSync(filesPath)) fs.mkdirSync(filesPath);
    // 生成檔案
    fs.writeFileSync(`${filesPath}/${fileName}`, uint8Array, "utf8");
  }

  /**
   * 群發紀錄生成 Excel
   * @param fileName
   * @param folderPath
   * @param filesPath
   */
  async motSendLogToExcel(
    rows,
    fileName: string,
    folderPath: string,
    filesPath: string,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("發送紀錄");

    // 定義表頭
    worksheet.columns = [
      { header: "會員卡號", key: "cardId", width: 15 },
      { header: "會員姓名", key: "memberName", width: 20 },
      { header: "手機國碼", key: "mobileCountryCode", width: 10 },
      { header: "手機號碼", key: "mobile", width: 20 },
      { header: "生日", key: "birthday", width: 15 },
      { header: "性別", key: "gender", width: 10 },
      { header: "Email", key: "email", width: 25 },
      { header: "會籍", key: "memberShipName", width: 15 },
      { header: "特殊會員類型", key: "specialCode", width: 20 },
      { header: "註冊日期", key: "registerDate", width: 15 },
      { header: "註冊渠道", key: "channel", width: 15 },
    ];

    // 凍結第一列
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 1,
      },
    ];

    // 第一列儲存格
    const fgColorCells = [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
    ];
    // 定義 儲存格格式
    fgColorCells.forEach((cell) => {
      worksheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "f2f2f2" },
      };
    });

    worksheet.addRows(rows);

    const buffer = await workbook.xlsx.writeBuffer();

    // Convert buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // 指定位置
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    if (!fs.existsSync(filesPath)) fs.mkdirSync(filesPath);
    // 生成檔案
    fs.writeFileSync(`${filesPath}/${fileName}`, uint8Array, "utf8");
  }
}

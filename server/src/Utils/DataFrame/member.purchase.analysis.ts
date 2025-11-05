// import { ChartConfiguration } from 'chart.js';
// import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
// import * as ExcelJS from 'exceljs';
// import {
//   couponPointRange_border,
//   historyYearPoint_border,
//   memberPointBalance_border,
//   memberShipCard_border,
//   monthData_border,
//   newOldMember_border,
//   summary_border,
//   thisMonthPointInfo_border,
//   thisMonthUsedPoint_border
// } from './excel.border';
// import {
//   alignment_horizontal,
//   bg_color,
//   floorToDecimal,
//   font_bold,
//   font_bold_color,
//   font_bold_size,
//   font_bold_size_color,
//   font_color,
//   font_size,
//   font_size_color,
//   getValue,
//   mergeCells,
//   numFmt,
//   richText,
//   value,
//   width
// } from './excel.funcion';
// import {
//   couponPointRange,
//   historyYearPoint,
//   memberPointBalance,
//   memberShipCardWording,
//   monthWording,
//   newOldMemberWording,
//   summaryWording,
//   thisMonthPointInfo,
//   thisMonthUsedPoint
// } from './excel.wording';
// const fs = require('fs');

// export class MemberPurchaseAnalysis {
//   /**
//    * 本月消費概況左側資料
//    * @param worksheet
//    * @param data
//    */
//   async summary(worksheet: ExcelJS.Worksheet, summaryValue: number[]) {
//     summary_border(worksheet);
//     width(worksheet, `A`, 20);

//     // #region 左邊總會員數．．．文字
//     const summaryWordingValue = summaryWording?.map((x) => x?.value);
//     const summaryWordingColumn = summaryWording?.map((x) => x?.column);

//     // 填入資料
//     for (let i = 0; i < summaryWordingColumn.length; i++) {
//       const cellAddress = summaryWordingColumn[i];
//       value(worksheet, cellAddress, summaryWordingValue[i]);
//     }
//     // #endregion 左邊總會員數．．．文字

//     // #region 左邊總會員數．．．值
//     // 無條件捨去到第一位
//     const summaryValueColumn = ['C4', 'C5', 'C7'];
//     for (let i = 0; i < summaryValueColumn.length; i++) {
//       const cellAddress = summaryValueColumn[i];
//       value(worksheet, cellAddress, summaryValue[i]);
//     }

//     // 消費會員數/總會員數 占比
//     const C6 =
//       (Number(getValue(worksheet, 'C5')) / Number(getValue(worksheet, 'C4'))) *
//       100;
//     value(worksheet, 'C6', `${floorToDecimal(C6, 1)}%`);
//     // #endregion 左邊總會員數．．．值

//     font_size(worksheet, 'A1', 18);
//     font_bold(worksheet, 'A3');
//     font_color(worksheet, 'C4', 'C00000');
//     font_color(worksheet, 'C6', '0070C0');
//     alignment_horizontal(worksheet, 'C6', 'right');

//     // 需要千位分隔符號並靠右對齊的欄位
//     const kiloAndRight = ['C4', 'C5', 'C7'];
//     kiloAndRight.forEach((x) => {
//       numFmt(worksheet, x, '#,##0');
//       alignment_horizontal(worksheet, x, 'right');
//     });

//     // 文字置中
//     for (let row = 4; row <= 7; row++) {
//       alignment_horizontal(worksheet, `A${row}`, 'center');
//     }
//   }

//   /**
//    * 本月消費概況右側資料
//    * @param worksheet
//    */
//   async monthData(worksheet: ExcelJS.Worksheet, dataValue: number[]) {
//     monthData_border(worksheet);
//     width(worksheet, `E`, 20);
//     for (let col = 6; col <= 22; col++) {
//       const column = String.fromCharCode(64 + col);
//       width(worksheet, column, 15);
//     }

//     const monthWordingValue = monthWording?.map((x) => x?.value);
//     const monthWordingColumn = monthWording?.map((x) => x?.column);

//     font_bold(worksheet, 'F4');
//     font_bold(worksheet, 'I4');
//     font_bold(worksheet, 'L4');
//     richText(worksheet, 'H5', ['會員消費額/', '集團營業額%']);
//     richText(worksheet, 'K5', ['會員消費額/', '集團營業額%']);

//     for (let i = 0; i < monthWordingColumn.length; i++) {
//       const cellAddress = monthWordingColumn[i];
//       value(worksheet, cellAddress, monthWordingValue[i]);
//     }

//     const dataColumn = [
//       'F4',
//       'I4',
//       'F6',
//       'G6',
//       'F7',
//       'G7',
//       'I6',
//       'J6',
//       'I7',
//       'J7'
//     ];
//     // 填入資料
//     for (let i = 0; i < dataColumn.length; i++) {
//       const cellAddress = dataColumn[i];
//       value(
//         worksheet,
//         cellAddress,
//         isNaN(Number(dataValue[i])) ? dataValue[i] : Number(dataValue[i])
//       );
//     }

//     // 營業淨額、消費淨額＆1-折扣率
//     const discountRateColoum = ['F', 'G', 'I', 'J'];
//     discountRateColoum.forEach((x) => {
//       value(
//         worksheet,
//         `${x}8`,
//         Number(getValue(worksheet, `${x}6`)) -
//           Number(getValue(worksheet, `${x}7`))
//       );
//       const vaule =
//         (Number(getValue(worksheet, `${x}8`)) /
//           Number(getValue(worksheet, `${x}6`))) *
//         100;

//       value(
//         worksheet,
//         `${x}9`,
//         `${
//           isNaN(floorToDecimal(vaule ?? 0, 1))
//             ? 0
//             : floorToDecimal(vaule ?? 0, 1)
//         }%`
//       );
//     });

//     for (let i = 6; i <= 8; i++) {
//       // 本月 "會員消費額/集團營業額%"
//       const thisMonthVaule =
//         (Number(getValue(worksheet, `G${i}`)) /
//           Number(getValue(worksheet, `F${i}`))) *
//         100;
//       value(
//         worksheet,
//         `H${i}`,
//         `${
//           isNaN(floorToDecimal(thisMonthVaule ?? 0, 1))
//             ? 0
//             : floorToDecimal(thisMonthVaule ?? 0, 1)
//         }%`
//       );

//       // 上個月 "會員消費額/集團營業額%"
//       const lastMonthVaule =
//         (Number(getValue(worksheet, `J${i}`)) /
//           Number(getValue(worksheet, `I${i}`))) *
//         100;
//       value(
//         worksheet,
//         `K${i}`,
//         `${
//           isNaN(floorToDecimal(lastMonthVaule ?? 0, 1))
//             ? 0
//             : floorToDecimal(lastMonthVaule ?? 0, 1)
//         }%`
//       );

//       // 集團 MoM
//       let groupValue =
//         ((Number(getValue(worksheet, `F${i}`)) -
//           Number(getValue(worksheet, `I${i}`))) /
//           Number(getValue(worksheet, `I${i}`))) *
//         100;
//       if (getValue(worksheet, `I${i}`) === 0) groupValue = 0;

//       value(
//         worksheet,
//         `L${i}`,
//         `${
//           isNaN(floorToDecimal(groupValue ?? 0, 1))
//             ? 0
//             : floorToDecimal(groupValue ?? 0, 1)
//         }%`
//       );

//       // 會員 MoM
//       let memberValue =
//         ((Number(getValue(worksheet, `G${i}`)) -
//           Number(getValue(worksheet, `J${i}`))) /
//           Number(getValue(worksheet, `J${i}`))) *
//         100;
//       if (getValue(worksheet, `J${i}`) === 0) memberValue = 0;
//       value(
//         worksheet,
//         `M${i}`,
//         `${
//           isNaN(floorToDecimal(memberValue ?? 0, 1))
//             ? 0
//             : floorToDecimal(memberValue ?? 0, 1)
//         }%`
//       );
//     }

//     // 文字置中
//     for (let row = 4; row <= 5; row++) {
//       for (let col = 5; col <= 13; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         alignment_horizontal(worksheet, column, 'center');
//       }
//     }
//     for (let row = 6; row <= 9; row++) {
//       alignment_horizontal(worksheet, `E${row}`, 'center');
//     }

//     // 文字格式設定
//     for (let row = 4; row <= 9; row++) {
//       for (let col = 5; col <= 13; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         if (
//           (row === 6 || row === 7 || row === 8 || row === 9) &&
//           (col === 6 ||
//             col === 7 ||
//             col === 8 ||
//             col === 9 ||
//             col === 10 ||
//             col === 11)
//         ) {
//           numFmt(worksheet, column, '#,##0');
//           alignment_horizontal(worksheet, column, 'right');
//         }
//         if (
//           (row === 9 && col !== 5) ||
//           (col === 8 && row > 5) ||
//           (col === 11 && row > 5)
//         ) {
//           font_color(worksheet, column, '0171C0');
//         }
//         if (col >= 12 && row > 5) {
//           const columnValue = getValue(worksheet, column);
//           const value = columnValue?.toString()?.split('%')?.[0];
//           Number(value) >= 0
//             ? font_bold_color(worksheet, column, '003399')
//             : font_bold_color(worksheet, column, 'C00000');
//           alignment_horizontal(worksheet, column, 'right');
//         }
//       }
//     }

//     // 背景色
//     for (let row = 4; row <= 9; row++) {
//       for (let col = 5; col <= 13; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         if (row <= 5) {
//           bg_color(worksheet, column, 'D8D8D8');
//         }
//         if (row > 5 && col === 5) {
//           bg_color(worksheet, column, 'F2F2F2');
//         }
//       }
//     }
//   }

//   /**
//    * 新舊會員消費分析
//    * @param worksheet
//    */
//   async newOldMember(worksheet: ExcelJS.Worksheet, dataValue: number[]) {
//     newOldMember_border(worksheet);
//     width(worksheet, 'B', 15);
//     width(worksheet, 'C', 15);
//     width(worksheet, 'D', 15);
//     width(worksheet, 'O', 20);
//     width(worksheet, 'P', 20);
//     richText(worksheet, 'G13', ['消費淨額/', '集團營業淨額%']);
//     richText(worksheet, 'K12', ['消費會員數', 'MoM']);
//     richText(worksheet, 'L12', ['會員消費淨額', 'MoM']);
//     alignment_horizontal(worksheet, 'G13', 'center');
//     alignment_horizontal(worksheet, 'K12', 'center');
//     alignment_horizontal(worksheet, 'L12', 'center');

//     const wordingColumn = newOldMemberWording?.map((x) => x.column);
//     const wordingValue = newOldMemberWording?.map((x) => x.value);

//     // 填入資料
//     for (let i = 0; i < wordingColumn.length; i++) {
//       if (i > 0) {
//         alignment_horizontal(worksheet, wordingColumn[i], 'center');
//       }
//       const cellAddress = wordingColumn[i];
//       value(worksheet, cellAddress, wordingValue[i]);
//     }

//     // 填入資料
//     const dataColumn = [
//       'B14',
//       'B15',
//       'C14',
//       'C15',
//       'E14',
//       'E15',
//       'F14',
//       'F15',
//       'I14',
//       'I15',
//       'J14',
//       'J15',
//       'K14',
//       'K15',
//       'L14',
//       'L15'
//     ];
//     for (let i = 0; i < dataColumn.length; i++) {
//       const cellAddress = dataColumn[i];
//       value(
//         worksheet,
//         cellAddress,
//         isNaN(Number(dataValue[i])) ? dataValue[i] : Number(dataValue[i])
//       );
//       numFmt(worksheet, cellAddress, '#,##0');
//     }

//     // 背景色
//     for (let row = 12; row <= 15; row++) {
//       for (let col = 1; col <= 16; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         if (row <= 13) {
//           bg_color(worksheet, column, 'D8D8D8');
//         }
//         if (row >= 14 && col === 1) {
//           bg_color(worksheet, column, 'F2F2F2');
//         }
//       }
//     }

//     // 加入粗體＆顏色
//     for (let row = 11; row <= 13; row++) {
//       for (let col = 1; col <= 16; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         if (row === 13 && (col === 9 || col === 15)) {
//           font_bold_color(worksheet, column, 'C00000');
//         } else if (column === 'D13' || column === 'G13') {
//           font_bold_size(worksheet, column, 9);
//         } else {
//           font_bold(worksheet, column);
//         }
//       }
//     }

//     // 文字格式設定
//     for (let row = 14; row <= 15; row++) {
//       // 本月會員消費數%
//       const dValue =
//         Number(getValue(worksheet, `C${row}`)) /
//         Number(getValue(worksheet, `C5`));
//       value(worksheet, `D${row}`, `${floorToDecimal(dValue ?? 0, 1)}%`);
//       font_color(worksheet, `D${row}`, '0171C0');
//       alignment_horizontal(worksheet, `D${row}`, 'right');

//       // 消費淨額/集團營業淨額%
//       const gValue =
//         Number(getValue(worksheet, `F${row}`)) /
//         Number(getValue(worksheet, `F8`));
//       value(worksheet, `G${row}`, `${floorToDecimal(gValue ?? 0, 1)}%`);
//       font_color(worksheet, `G${row}`, '0171C0');
//       alignment_horizontal(worksheet, `G${row}`, 'right');

//       // 1-折扣率
//       const hValue =
//         Number(getValue(worksheet, `F${row}`)) /
//         Number(getValue(worksheet, `E${row}`));
//       value(
//         worksheet,
//         `H${row}`,
//         isNaN(floorToDecimal(hValue ?? 0, 1))
//           ? 0
//           : `${floorToDecimal(hValue ?? 0, 1)}%`
//       );
//       font_color(worksheet, `H${row}`, '0171C0');
//       alignment_horizontal(worksheet, `H${row}`, 'right');
//     }

//     for (let row = 14; row <= 15; row++) {
//       // 消費會員數 MoM、會員消費淨額MoM
//       for (let col = 11; col <= 12; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         const columnValue = getValue(worksheet, column);
//         Number(columnValue) >= 0
//           ? font_bold_color(worksheet, column, '003399')
//           : font_bold_color(worksheet, column, 'C00000');
//         alignment_horizontal(worksheet, column, 'right');
//         value(
//           worksheet,
//           column,
//           `${floorToDecimal(Number(columnValue) ?? 0, 1)}%`
//         );
//       }
//       // 本月平均一個會員消費數據
//       for (let col = 13; col <= 16; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         switch (col) {
//           case 13:
//             const value_13 =
//               Number(getValue(worksheet, `E${row}`)) /
//               Number(getValue(worksheet, `C${row}`));
//             value(worksheet, column, parseInt(value_13.toString()));
//             numFmt(worksheet, column, '#,##0');
//             break;
//           case 14:
//             const value_14 =
//               Number(getValue(worksheet, `J${row}`)) /
//               Number(getValue(worksheet, `C${row}`));
//             value(worksheet, column, floorToDecimal(Number(value_14) ?? 0, 1));
//             break;
//           case 15:
//             const value_15 =
//               Number(getValue(worksheet, `I${row}`)) /
//               Number(getValue(worksheet, `J${row}`));
//             value(worksheet, column, floorToDecimal(Number(value_15) ?? 0, 1));
//             break;
//           case 16:
//             const value_16 =
//               Number(getValue(worksheet, `M${row}`)) /
//               Number(getValue(worksheet, `N${row}`));
//             value(worksheet, column, parseInt(value_16.toString()));
//             numFmt(worksheet, column, '#,##0');
//             break;
//         }
//       }
//     }
//   }

//   /**
//    * 會員卡別消費分析
//    * @param worksheet
//    */
//   async memberShipCard(worksheet: ExcelJS.Worksheet, dataValue: number[]) {
//     memberShipCard_border(worksheet);
//     richText(worksheet, 'G19', ['消費淨額/', '集團營業淨額%']);
//     richText(worksheet, 'K18', ['消費會員數', 'MoM']);
//     richText(worksheet, 'L18', ['會員消費淨額', 'MoM']);
//     alignment_horizontal(worksheet, 'G19', 'center');
//     alignment_horizontal(worksheet, 'K18', 'center');
//     alignment_horizontal(worksheet, 'L18', 'center');

//     // 填入 wording
//     const wordingColumn = memberShipCardWording?.map((x) => x.column);
//     const wordingValue = memberShipCardWording?.map((x) => x.value);
//     for (let i = 0; i < wordingColumn.length; i++) {
//       if (i > 0) {
//         alignment_horizontal(worksheet, wordingColumn[i], 'center');
//       }
//       const cellAddress = wordingColumn[i];
//       value(worksheet, cellAddress, wordingValue[i]);
//     }

//     // 填入資料
//     const dataColumn = [
//       'A20',
//       'B20',
//       'C20',
//       'E20',
//       'F20',
//       'I20',
//       'J20',
//       'K20',
//       'L20',
//       'A21',
//       'B21',
//       'C21',
//       'E21',
//       'F21',
//       'I21',
//       'J21',
//       'K21',
//       'L21',
//       'A22',
//       'B22',
//       'C22',
//       'E22',
//       'F22',
//       'I22',
//       'J22',
//       'K22',
//       'L22'
//     ];
//     for (let i = 0; i < dataColumn.length; i++) {
//       const cellAddress = dataColumn[i];
//       value(
//         worksheet,
//         cellAddress,
//         isNaN(Number(dataValue[i])) ? dataValue[i] : Number(dataValue[i])
//       );
//       numFmt(worksheet, cellAddress, '#,##0');
//     }

//     // 背景色
//     for (let row = 18; row <= 22; row++) {
//       for (let col = 1; col <= 16; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         if (row <= 19) {
//           bg_color(worksheet, column, 'D8D8D8');
//         }
//       }
//     }

//     // 會籍名稱樣式
//     for (let row = 20; row <= 22; row++) {
//       switch (row) {
//         case 20:
//           bg_color(worksheet, `A${row}`, '3F3F3F');
//           break;
//         case 21:
//           bg_color(worksheet, `A${row}`, 'BF9001');
//           break;
//         case 22:
//           bg_color(worksheet, `A${row}`, '8496B0');
//           break;
//       }
//       font_bold_color(worksheet, `A${row}`, 'FFFFFF');
//       alignment_horizontal(worksheet, `A${row}`, 'center');
//     }

//     // 加入粗體＆顏色
//     for (let row = 17; row <= 19; row++) {
//       for (let col = 1; col <= 16; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         if (row === 19 && (col === 9 || col === 15)) {
//           font_bold_color(worksheet, column, 'C00000');
//         } else if (column === 'D19' || column === 'G19') {
//           font_bold_size(worksheet, column, 9);
//         } else {
//           font_bold(worksheet, column);
//         }
//       }
//     }

//     // 文字格式設定
//     for (let row = 20; row <= 22; row++) {
//       // 本月會員消費數%
//       const dValue =
//         Number(getValue(worksheet, `C${row}`)) /
//         Number(getValue(worksheet, `B${row}`));
//       value(worksheet, `D${row}`, `${floorToDecimal(dValue ?? 0, 1)}%`);
//       font_color(worksheet, `D${row}`, '0171C0');
//       alignment_horizontal(worksheet, `D${row}`, 'right');

//       // 消費淨額/集團營業淨額%
//       const gValue =
//         Number(getValue(worksheet, `F${row}`)) /
//         Number(getValue(worksheet, `F8`));
//       value(worksheet, `G${row}`, `${floorToDecimal(gValue ?? 0, 1)}%`);
//       font_color(worksheet, `G${row}`, '0171C0');
//       alignment_horizontal(worksheet, `G${row}`, 'right');

//       // 1-折扣率
//       const hValue =
//         Number(getValue(worksheet, `F${row}`)) /
//         Number(getValue(worksheet, `E${row}`));
//       value(
//         worksheet,
//         `H${row}`,
//         isNaN(floorToDecimal(hValue ?? 0, 1))
//           ? 0
//           : `${floorToDecimal(hValue ?? 0, 1)}%`
//       );
//       font_color(worksheet, `H${row}`, '0171C0');
//       alignment_horizontal(worksheet, `H${row}`, 'right');
//     }

//     for (let row = 20; row <= 22; row++) {
//       // 消費會員數 MoM、會員消費淨額MoM
//       for (let col = 11; col <= 12; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         const columnValue = getValue(worksheet, column);
//         Number(columnValue) >= 0
//           ? font_bold_color(worksheet, column, '003399')
//           : font_bold_color(worksheet, column, 'C00000');
//         alignment_horizontal(worksheet, column, 'right');
//         value(
//           worksheet,
//           column,
//           `${floorToDecimal(Number(columnValue) ?? 0, 1)}%`
//         );
//       }
//       // 本月平均一個會員消費數據
//       for (let col = 13; col <= 16; col++) {
//         const column = `${String.fromCharCode(64 + col)}${row}`;
//         switch (col) {
//           case 13:
//             const value_13 =
//               Number(getValue(worksheet, `E${row}`)) /
//               Number(getValue(worksheet, `C${row}`));
//             value(worksheet, column, parseInt(value_13.toString()));
//             numFmt(worksheet, column, '#,##0');
//             break;
//           case 14:
//             const value_14 =
//               Number(getValue(worksheet, `J${row}`)) /
//               Number(getValue(worksheet, `C${row}`));
//             value(worksheet, column, floorToDecimal(Number(value_14) ?? 0, 1));
//             break;
//           case 15:
//             const value_15 =
//               Number(getValue(worksheet, `I${row}`)) /
//               Number(getValue(worksheet, `J${row}`));
//             value(worksheet, column, floorToDecimal(Number(value_15) ?? 0, 1));
//             break;
//           case 16:
//             const value_16 =
//               Number(getValue(worksheet, `M${row}`)) /
//               Number(getValue(worksheet, `N${row}`));
//             value(worksheet, column, parseInt(value_16.toString()));
//             numFmt(worksheet, column, '#,##0');
//             break;
//         }
//       }
//     }
//   }

//   async testReport(data) {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('會員消費分析');

//     // 需要合併儲存格的欄位
//     const columnRanges = [
//       ['A1', 'Z1'],
//       ['A3', 'Z3'],
//       ['A11', 'Z11'],
//       ['A17', 'Z17'],
//       ['A24', 'Z24'],
//       ['A31', 'Z31'],
//       ['A38', 'Z38'],
//       ['A50', 'Z50'],
//       ['A63', 'Z63'],
//       ['A73', 'Z73'],
//       ['A18', 'A19'],
//       ['B18', 'B19'],
//       ['K18', 'K19'],
//       ['L18', 'L19'],
//       ['C18', 'J18'],
//       ['M18', 'P18'],
//       ['A4', 'B4'],
//       ['A5', 'B5'],
//       ['A6', 'B6'],
//       ['A7', 'B7'],
//       ['C4', 'D4'],
//       ['C5', 'D5'],
//       ['C6', 'D6'],
//       ['C7', 'D7'],
//       ['E4', 'E5'],
//       ['F4', 'H4'],
//       ['I4', 'K4'],
//       ['L4', 'M4'],
//       ['A12', 'A13'],
//       ['B12', 'B13'],
//       ['C12', 'J12'],
//       ['K12', 'K13'],
//       ['L12', 'L13'],
//       ['M12', 'P12']
//     ];
//     for (const [startCell, endCell] of columnRanges) {
//       mergeCells(worksheet, `${startCell}:${endCell}`);
//     }
//     await this.summary(worksheet, data?.summaryData);
//     await this.monthData(worksheet, data?.monthData);
//     await this.newOldMember(worksheet, data?.newOldMemberData);
//     await this.memberShipCard(worksheet, data?.memberShipData);

//     const dir = __dirname;
//     const fileName = 'excelDemo.xlsx';
//     // 將工作簿寫入檔案
//     workbook.xlsx
//       .writeFile(`${dir}/${fileName}`)
//       .then(function () {
//         console.log('檔案已儲存');
//       })
//       .catch(function (error) {
//         console.log('發生錯誤：', error);
//       });

//     return { dir, fileName };
//   }

//   /**
//    * 本月點數概況
//    * @param worksheet
//    */
//   async thisMonthPointInfo(
//     worksheet: ExcelJS.Worksheet,
//     pointInfoValue: number[]
//   ) {
//     thisMonthPointInfo_border(worksheet);

//     // #region 左邊點數概況．．．文字
//     const thisMonthPointInfoValue = thisMonthPointInfo?.map((x) => x?.value);
//     const thisMonthPointInfoColumn = thisMonthPointInfo?.map((x) => x?.column);

//     // 填入資料
//     for (let i = 0; i < thisMonthPointInfoColumn.length; i++) {
//       const cellAddress = thisMonthPointInfoColumn[i];
//       value(worksheet, cellAddress, thisMonthPointInfoValue[i]);
//       font_size(worksheet, cellAddress, 12);
//     }

//     // #region 左邊點數概況．．．值
//     // 無條件捨去到第一位
//     const summaryValueColumn = ['C4', 'C5', 'C6'];
//     for (let i = 0; i < summaryValueColumn.length; i++) {
//       const cellAddress = summaryValueColumn[i];
//       value(worksheet, cellAddress, pointInfoValue[i]);
//       font_size(worksheet, cellAddress, 12);
//     }

//     // 本月兌換點數/本月發行點數 本月點數回收率 占比
//     const C7 =
//       Number(getValue(worksheet, 'C4')) == 0
//         ? 0
//         : (Number(getValue(worksheet, 'C5')) /
//             Number(getValue(worksheet, 'C4'))) *
//           100;
//     value(worksheet, 'C7', `${floorToDecimal(C7, 1)}%`);

//     font_bold_size(worksheet, 'A3', 12);
//     font_color(worksheet, 'C7', '0070C0');
//     alignment_horizontal(worksheet, 'C7', 'right');

//     // 需要千位分隔符號並靠右對齊的欄位
//     const kiloAndRight = ['C4', 'C5', 'C6'];
//     kiloAndRight.forEach((x) => {
//       numFmt(worksheet, x, '#,##0 ; -0 ; -   ; @ ');
//       alignment_horizontal(worksheet, x, 'right');
//     });

//     // 文字置中/背景色
//     for (let row = 4; row <= 7; row++) {
//       alignment_horizontal(worksheet, `A${row}`, 'center');
//       bg_color(worksheet, `A${row}`, 'F2F2F2');
//     }
//   }

//   /**
//    * 歷年點數發行&兌換
//    * @param worksheet
//    */
//   async historyYearPoint(worksheet: ExcelJS.Worksheet, pointHistoryYearValue) {
//     historyYearPoint_border(worksheet);

//     // 標題列
//     const historyYearPointValue = historyYearPoint?.map((x) => x?.value);
//     const historyYearPointColumn = historyYearPoint?.map((x) => x?.column);

//     // 填入資料
//     for (let i = 0; i < historyYearPointColumn.length; i++) {
//       const cellAddress = historyYearPointColumn[i];
//       value(worksheet, cellAddress, historyYearPointValue[i]);
//       font_bold_size(worksheet, cellAddress, 12);
//     }

//     const valueColumn = ['A10', 'B10', 'C10', 'D10'];
//     for (let i = 0; i < valueColumn.length; i++) {
//       const cellAddress = valueColumn[i];
//       bg_color(worksheet, cellAddress, 'D8D8D8');
//       alignment_horizontal(worksheet, cellAddress, 'center');
//     }

//     let row = 11;
//     for (const data of pointHistoryYearValue) {
//       value(worksheet, `A${row}`, data?.year);
//       value(worksheet, `B${row}`, data?.sendPoint);
//       value(worksheet, `C${row}`, data?.exchangePoint);

//       value(
//         worksheet,
//         `D${row}`,
//         `${floorToDecimal(
//           Number(getValue(worksheet, `C${row}`)) == 0
//             ? 0
//             : (Number(getValue(worksheet, `C${row}`)) /
//                 Number(getValue(worksheet, `B${row}`))) *
//                 100,
//           1
//         )}%`
//       );

//       alignment_horizontal(worksheet, `A${row}`, 'center');
//       numFmt(worksheet, `B${row}`, '#,##0 ; -0 ; -   ; @ ');
//       alignment_horizontal(worksheet, `B${row}`, 'right');
//       numFmt(worksheet, `C${row}`, '#,##0 ; -0 ; -   ; @ ');
//       alignment_horizontal(worksheet, `C${row}`, 'right');
//       alignment_horizontal(worksheet, `D${row}`, 'right');
//       font_size(worksheet, `A${row}`, 12);
//       font_size(worksheet, `B${row}`, 12);
//       font_size(worksheet, `C${row}`, 12);
//       font_size_color(worksheet, `D${row}`, 12, '0070C0');
//       row++;
//     }

//     bg_color(worksheet, 'A16', 'DEEAF6');
//     bg_color(worksheet, 'B16', 'DEEAF6');
//     bg_color(worksheet, 'C16', 'DEEAF6');
//     bg_color(worksheet, 'D16', 'C5E0B3');
//   }

//   /**
//    * 現有會員持有點數分佈
//    * @param worksheet
//    */
//   async memberPointBalance(worksheet: ExcelJS.Worksheet, pointBalanceValue) {
//     memberPointBalance_border(worksheet);

//     // 標題列
//     const memberPointBalanceValue = memberPointBalance?.map((x) => x?.value);
//     const memberPointBalanceColumn = memberPointBalance?.map((x) => x?.column);

//     // 填入資料
//     for (let i = 0; i < memberPointBalanceColumn.length; i++) {
//       const cellAddress = memberPointBalanceColumn[i];
//       value(worksheet, cellAddress, memberPointBalanceValue[i]);
//       font_bold_size(worksheet, cellAddress, 12);
//     }

//     const sumMemberCount = Number(pointBalanceValue.slice(-1)[0].memberCount);
//     const sumPointTotal = Number(pointBalanceValue.slice(-1)[0].pointTotal);

//     let row = 22;
//     for (const data of pointBalanceValue) {
//       value(worksheet, `A${row}`, data?.pointRange);
//       alignment_horizontal(worksheet, `A${row}`, 'center');
//       font_size(worksheet, `A${row}`, 12);
//       bg_color(worksheet, `A${row}`, 'F2F2F2');

//       value(worksheet, `B${row}`, data?.memberCount);
//       alignment_horizontal(worksheet, `B${row}`, 'right');
//       numFmt(worksheet, `B${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `B${row}`, 12);

//       const sumMemberCountVal =
//         sumMemberCount == 0
//           ? 0
//           : floorToDecimal(Number(data?.memberCount) / sumMemberCount, 3);
//       value(worksheet, `C${row}`, sumMemberCountVal);
//       alignment_horizontal(worksheet, `C${row}`, 'right');
//       numFmt(worksheet, `C${row}`, '0.0%');
//       font_size_color(worksheet, `C${row}`, 12, '0070C0');

//       value(worksheet, `E${row}`, data?.pointTotal);
//       alignment_horizontal(worksheet, `E${row}`, 'right');
//       numFmt(worksheet, `E${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `E${row}`, 12);

//       const sumPointTotalVal =
//         sumPointTotal == 0
//           ? 0
//           : floorToDecimal(Number(data?.pointTotal) / sumPointTotal, 3);
//       value(worksheet, `F${row}`, sumPointTotalVal);
//       alignment_horizontal(worksheet, `F${row}`, 'right');
//       numFmt(worksheet, `F${row}`, '0.0%');
//       font_size_color(worksheet, `F${row}`, 12, '0070C0');

//       value(worksheet, `G${row}`, data?.level0);
//       alignment_horizontal(worksheet, `G${row}`, 'right');
//       numFmt(worksheet, `G${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `G${row}`, 12);

//       const level0Val =
//         Number(data?.memberCount) == 0
//           ? 0
//           : Number(data?.level0) / Number(data?.memberCount);
//       value(worksheet, `H${row}`, level0Val);
//       alignment_horizontal(worksheet, `H${row}`, 'right');
//       numFmt(worksheet, `H${row}`, '0.0%');
//       font_size_color(worksheet, `H${row}`, 12, '0070C0');

//       value(worksheet, `I${row}`, data?.level1);
//       alignment_horizontal(worksheet, `I${row}`, 'right');
//       numFmt(worksheet, `I${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `I${row}`, 12);

//       const level1Val =
//         Number(data?.memberCount) == 0
//           ? 0
//           : Number(data?.level1) / Number(data?.memberCount);
//       value(worksheet, `J${row}`, level1Val);
//       alignment_horizontal(worksheet, `J${row}`, 'right');
//       numFmt(worksheet, `J${row}`, '0.0%');
//       font_size_color(worksheet, `J${row}`, 12, '0070C0');

//       value(worksheet, `K${row}`, data?.level2);
//       alignment_horizontal(worksheet, `K${row}`, 'right');
//       numFmt(worksheet, `K${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `K${row}`, 12);

//       const level2Val =
//         Number(data?.memberCount) == 0
//           ? 0
//           : Number(data?.level2) / Number(data?.memberCount);
//       value(worksheet, `L${row}`, level2Val);
//       alignment_horizontal(worksheet, `L${row}`, 'right');
//       numFmt(worksheet, `L${row}`, '0.0%');
//       font_size_color(worksheet, `L${row}`, 12, '0070C0');
//       row++;
//     }

//     const sumColumn = [
//       'A40',
//       'B40',
//       'C40',
//       'D40',
//       'E40',
//       'F40',
//       'G40',
//       'H40',
//       'I40',
//       'J40',
//       'K40',
//       'L40'
//     ];
//     for (let i = 0; i < sumColumn.length; i++) {
//       const cellAddress = sumColumn[i];
//       bg_color(worksheet, cellAddress, 'DEEAF6');
//     }

//     const valueColumn = [
//       'A20',
//       'B20',
//       'C20',
//       'D20',
//       'E20',
//       'F20',
//       'G21',
//       'H21',
//       'I21',
//       'J21',
//       'K21',
//       'L21'
//     ];
//     for (let i = 0; i < valueColumn.length; i++) {
//       const cellAddress = valueColumn[i];
//       bg_color(worksheet, cellAddress, 'D8D8D8');
//       alignment_horizontal(worksheet, cellAddress, 'center');
//     }

//     // 背景顏色＆字體顏色大小
//     bg_color(worksheet, 'G20', '3F3F3F');
//     font_bold_size_color(worksheet, 'G20', 12, 'FFFFFF');
//     alignment_horizontal(worksheet, 'G20', 'center');
//     bg_color(worksheet, 'I20', 'BF9000');
//     font_bold_size_color(worksheet, 'I20', 12, 'FFFFFF');
//     alignment_horizontal(worksheet, 'I20', 'center');
//     bg_color(worksheet, 'K20', '8496B0');
//     font_bold_size_color(worksheet, 'K20', 12, 'FFFFFF');
//     alignment_horizontal(worksheet, 'K20', 'center');
//   }

//   /**
//    * 本月使用點數統計
//    * @param worksheet
//    */
//   async thisMonthUsedPoint(worksheet: ExcelJS.Worksheet, usedPointsValue) {
//     thisMonthUsedPoint_border(worksheet);

//     // 標題列
//     const thisMonthUsedPointValue = thisMonthUsedPoint?.map((x) => x?.value);
//     const thisMonthUsedPointColumn = thisMonthUsedPoint?.map((x) => x?.column);

//     // 填入資料
//     for (let i = 0; i < thisMonthUsedPointColumn.length; i++) {
//       const cellAddress = thisMonthUsedPointColumn[i];
//       value(worksheet, cellAddress, thisMonthUsedPointValue[i]);
//       font_bold_size(worksheet, cellAddress, 12);
//     }

//     const sumMemberCount = Number(usedPointsValue.slice(-1)[0].memberCount);
//     const sumPointTotal = Number(usedPointsValue.slice(-1)[0].pointTotal);

//     let row = 45;
//     for (const data of usedPointsValue) {
//       value(worksheet, `A${row}`, data?.pointRange);
//       alignment_horizontal(worksheet, `A${row}`, 'center');
//       font_size(worksheet, `A${row}`, 12);
//       bg_color(worksheet, `A${row}`, 'F2F2F2');

//       value(worksheet, `B${row}`, data?.memberCount);
//       alignment_horizontal(worksheet, `B${row}`, 'right');
//       numFmt(worksheet, `B${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `B${row}`, 12);

//       const sumMemberCountVal =
//         sumMemberCount == 0
//           ? 0
//           : floorToDecimal(Number(data?.memberCount) / sumMemberCount, 3);
//       value(worksheet, `C${row}`, sumMemberCountVal);
//       alignment_horizontal(worksheet, `C${row}`, 'right');
//       numFmt(worksheet, `C${row}`, '0.0%');
//       font_size_color(worksheet, `C${row}`, 12, '0070C0');

//       value(worksheet, `E${row}`, data?.pointTotal);
//       alignment_horizontal(worksheet, `E${row}`, 'right');
//       numFmt(worksheet, `E${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `E${row}`, 12);

//       const sumPointTotalVal =
//         sumPointTotal == 0
//           ? 0
//           : floorToDecimal(Number(data?.pointTotal) / sumPointTotal, 3);
//       value(worksheet, `F${row}`, sumPointTotalVal);
//       alignment_horizontal(worksheet, `F${row}`, 'right');
//       numFmt(worksheet, `F${row}`, '0.0%');
//       font_size_color(worksheet, `F${row}`, 12, '0070C0');

//       value(worksheet, `G${row}`, data?.level0);
//       alignment_horizontal(worksheet, `G${row}`, 'right');
//       numFmt(worksheet, `G${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `G${row}`, 12);

//       const level0Val =
//         Number(data?.memberCount) == 0
//           ? 0
//           : Number(data?.level0) / Number(data?.memberCount);
//       value(worksheet, `H${row}`, level0Val);
//       alignment_horizontal(worksheet, `H${row}`, 'right');
//       numFmt(worksheet, `H${row}`, '0.0%');
//       font_size_color(worksheet, `H${row}`, 12, '0070C0');

//       value(worksheet, `I${row}`, data?.level1);
//       alignment_horizontal(worksheet, `I${row}`, 'right');
//       numFmt(worksheet, `I${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `I${row}`, 12);

//       const level1Val =
//         Number(data?.memberCount) == 0
//           ? 0
//           : Number(data?.level1) / Number(data?.memberCount);
//       value(worksheet, `J${row}`, level1Val);
//       alignment_horizontal(worksheet, `J${row}`, 'right');
//       numFmt(worksheet, `J${row}`, '0.0%');
//       font_size_color(worksheet, `J${row}`, 12, '0070C0');

//       value(worksheet, `K${row}`, data?.level2);
//       alignment_horizontal(worksheet, `K${row}`, 'right');
//       numFmt(worksheet, `K${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `K${row}`, 12);

//       const level2Val =
//         Number(data?.memberCount) == 0
//           ? 0
//           : Number(data?.level2) / Number(data?.memberCount);
//       value(worksheet, `L${row}`, level2Val);
//       alignment_horizontal(worksheet, `L${row}`, 'right');
//       numFmt(worksheet, `L${row}`, '0.0%');
//       font_size_color(worksheet, `L${row}`, 12, '0070C0');
//       row++;
//     }

//     const sumColumn = [
//       'A63',
//       'B63',
//       'C63',
//       'D63',
//       'E63',
//       'F63',
//       'G63',
//       'H63',
//       'I63',
//       'J63',
//       'K63',
//       'L63'
//     ];
//     for (let i = 0; i < sumColumn.length; i++) {
//       const cellAddress = sumColumn[i];
//       bg_color(worksheet, cellAddress, 'DEEAF6');
//     }

//     const valueColumn = [
//       'A43',
//       'B43',
//       'C43',
//       'D43',
//       'E43',
//       'F43',
//       'G44',
//       'H44',
//       'I44',
//       'J44',
//       'K44',
//       'L44'
//     ];
//     for (let i = 0; i < valueColumn.length; i++) {
//       const cellAddress = valueColumn[i];
//       bg_color(worksheet, cellAddress, 'D8D8D8');
//       alignment_horizontal(worksheet, cellAddress, 'center');
//     }

//     // 背景顏色＆字體顏色大小
//     bg_color(worksheet, 'G43', '3F3F3F');
//     font_bold_size_color(worksheet, 'G43', 12, 'FFFFFF');
//     alignment_horizontal(worksheet, 'G43', 'center');
//     bg_color(worksheet, 'I43', 'BF9000');
//     font_bold_size_color(worksheet, 'I43', 12, 'FFFFFF');
//     alignment_horizontal(worksheet, 'I43', 'center');
//     bg_color(worksheet, 'K43', '8496B0');
//     font_bold_size_color(worksheet, 'K43', 12, 'FFFFFF');
//     alignment_horizontal(worksheet, 'K43', 'center');
//   }

//   /**
//    * 點數統計
//    * @param data
//    * @returns
//    */
//   async pointTest(data) {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('點數統計');

//     // 需要合併儲存格的欄位
//     const columnRanges = [
//       ['A1', 'L1'],
//       ['A3', 'B3'],
//       ['A4', 'B4'],
//       ['C4', 'D4'],
//       ['A5', 'B5'],
//       ['C5', 'D5'],
//       ['A6', 'B6'],
//       ['C6', 'D6'],
//       ['A7', 'B7'],
//       ['C7', 'D7'],
//       ['A9', 'D9'],
//       ['A19', 'L19'],
//       ['A20', 'A21'],
//       ['B20', 'B21'],
//       ['C20', 'C21'],
//       ['D20', 'D21'],
//       ['E20', 'E21'],
//       ['F20', 'F21'],
//       ['G20', 'H20'],
//       ['I20', 'J20'],
//       ['K20', 'L20'],
//       ['A42', 'L42'],
//       ['A43', 'A44'],
//       ['B43', 'B44'],
//       ['C43', 'C44'],
//       ['D43', 'D44'],
//       ['E43', 'E44'],
//       ['F43', 'F44'],
//       ['G43', 'H43'],
//       ['I43', 'J43'],
//       ['K43', 'L43']
//     ];
//     for (const [startCell, endCell] of columnRanges) {
//       mergeCells(worksheet, `${startCell}:${endCell}`);
//     }

//     width(worksheet, `A`, 17);
//     width(worksheet, `B`, 17);
//     width(worksheet, `C`, 17);
//     width(worksheet, `D`, 13);
//     width(worksheet, `E`, 13);
//     width(worksheet, `F`, 17);
//     width(worksheet, `G`, 13);
//     width(worksheet, `H`, 19);
//     width(worksheet, `I`, 13);
//     width(worksheet, `J`, 19);
//     width(worksheet, `K`, 13);
//     width(worksheet, `L`, 19);
//     value(worksheet, 'A1', '4. 點數統計');
//     font_bold_size(worksheet, 'A1', 18);

//     await this.thisMonthPointInfo(worksheet, data?.pointInfoValue);
//     await this.historyYearPoint(worksheet, data?.pointHistoryYearValue);
//     await this.memberPointBalance(worksheet, data?.pointBalanceValue);
//     await this.thisMonthUsedPoint(worksheet, data?.usedPointsValue);

//     const dir = __dirname;
//     const fileName = 'excelDemo.xlsx';

//     // 將工作簿寫入檔案
//     workbook.xlsx
//       .writeFile(`${dir}/${fileName}`)
//       .then(function () {
//         console.log('檔案已儲存');
//       })
//       .catch(function (error) {
//         console.log('發生錯誤：', error);
//       });

//     return { dir, fileName };
//   }

//   /**
//    * 普通兌換 - 依點數區間統計
//    * @param worksheet
//    * @param couponPointRangeValue
//    */
//   async couponPointRange(worksheet: ExcelJS.Worksheet, pointRangeValue) {
//     couponPointRange_border(worksheet);

//     // 標題列
//     const couponPointRangeValue = couponPointRange?.map((x) => x?.value);
//     const couponPointRangeColumn = couponPointRange?.map((x) => x?.column);

//     // 填入資料
//     for (let i = 0; i < couponPointRangeColumn.length; i++) {
//       const cellAddress = couponPointRangeColumn[i];
//       value(worksheet, cellAddress, couponPointRangeValue[i]);
//       font_bold_size(worksheet, cellAddress, 12);
//     }

//     let row = 38;
//     for (const data of pointRangeValue) {
//       value(worksheet, `A${row}`, data?.pointRange);
//       alignment_horizontal(worksheet, `A${row}`, 'center');
//       font_size(worksheet, `A${row}`, 12);
//       bg_color(worksheet, `A${row}`, 'F2F2F2');

//       value(worksheet, `C${row}`, data?.couponCount);
//       alignment_horizontal(worksheet, `C${row}`, 'right');
//       numFmt(worksheet, `C${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `C${row}`, 12);

//       value(worksheet, `D${row}`, data?.sendCount);
//       alignment_horizontal(worksheet, `D${row}`, 'right');
//       numFmt(worksheet, `D${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `D${row}`, 12);

//       value(worksheet, `E${row}`, data?.usedCount);
//       alignment_horizontal(worksheet, `E${row}`, 'right');
//       numFmt(worksheet, `E${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `E${row}`, 12);

//       const usedRate =
//         Number(data?.sendCount) == 0
//           ? 0
//           : Number(data?.usedCount) / Number(data?.sendCount);
//       value(worksheet, `F${row}`, usedRate);
//       alignment_horizontal(worksheet, `F${row}`, 'right');
//       numFmt(worksheet, `F${row}`, '0.0%');
//       font_size_color(worksheet, `F${row}`, 12, '0070C0');

//       value(worksheet, `G${row}`, data?.storeUsedCount);
//       alignment_horizontal(worksheet, `G${row}`, 'right');
//       numFmt(worksheet, `G${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_bold_size_color(worksheet, `G${row}`, 12, '00B050');

//       value(worksheet, `H${row}`, data?.mom);
//       alignment_horizontal(worksheet, `H${row}`, 'right');
//       numFmt(worksheet, `H${row}`, '0.0%');
//       if (Number(data?.mom) < 0) {
//         font_bold_size_color(worksheet, `H${row}`, 12, 'C00000');
//       } else {
//         font_bold_size_color(worksheet, `H${row}`, 12, '003399');
//       }

//       value(worksheet, `I${row}`, data?.level0);
//       alignment_horizontal(worksheet, `I${row}`, 'right');
//       numFmt(worksheet, `I${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `I${row}`, 12);

//       const level0Val =
//         Number(data?.sendCount) == 0
//           ? 0
//           : Number(data?.level0) / Number(data?.sendCount);
//       value(worksheet, `J${row}`, level0Val);
//       alignment_horizontal(worksheet, `J${row}`, 'right');
//       numFmt(worksheet, `J${row}`, '0.0%');
//       font_size_color(worksheet, `J${row}`, 12, '0070C0');

//       value(worksheet, `K${row}`, data?.level1);
//       alignment_horizontal(worksheet, `K${row}`, 'right');
//       numFmt(worksheet, `K${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `K${row}`, 12);

//       const level1Val =
//         Number(data?.sendCount) == 0
//           ? 0
//           : Number(data?.level1) / Number(data?.sendCount);
//       value(worksheet, `L${row}`, level1Val);
//       alignment_horizontal(worksheet, `L${row}`, 'right');
//       numFmt(worksheet, `L${row}`, '0.0%');
//       font_size_color(worksheet, `L${row}`, 12, '0070C0');

//       value(worksheet, `M${row}`, data?.level2);
//       alignment_horizontal(worksheet, `M${row}`, 'right');
//       numFmt(worksheet, `M${row}`, '#,##0 ; -0 ; -   ; @ ');
//       font_size(worksheet, `M${row}`, 12);

//       const level2Val =
//         Number(data?.sendCount) == 0
//           ? 0
//           : Number(data?.level2) / Number(data?.sendCount);
//       value(worksheet, `N${row}`, level2Val);
//       alignment_horizontal(worksheet, `N${row}`, 'right');
//       numFmt(worksheet, `N${row}`, '0.0%');
//       font_size_color(worksheet, `N${row}`, 12, '0070C0');
//       row++;
//     }

//     const sumColumn = [
//       'A56',
//       'C56',
//       'D56',
//       'E56',
//       'F56',
//       'I56',
//       'J56',
//       'K56',
//       'L56',
//       'M56',
//       'N56'
//     ];
//     for (let i = 0; i < sumColumn.length; i++) {
//       const cellAddress = sumColumn[i];
//       bg_color(worksheet, cellAddress, 'DEEAF6');
//     }

//     const sumColumnSp = ['G56', 'H56'];
//     for (let i = 0; i < sumColumnSp.length; i++) {
//       const cellAddress = sumColumnSp[i];
//       bg_color(worksheet, cellAddress, 'C5E0B3');
//     }

//     const valueColumn = [
//       'A36',
//       'C36',
//       'D36',
//       'E36',
//       'F36',
//       'G36',
//       'H36',
//       'I37',
//       'J37',
//       'K37',
//       'L37',
//       'M37',
//       'N37'
//     ];
//     for (let i = 0; i < valueColumn.length; i++) {
//       const cellAddress = valueColumn[i];
//       bg_color(worksheet, cellAddress, 'D8D8D8');
//       alignment_horizontal(worksheet, cellAddress, 'center');
//     }

//     // 背景顏色＆字體顏色大小
//     bg_color(worksheet, 'I36', '3F3F3F');
//     font_bold_size_color(worksheet, 'I36', 12, 'FFFFFF');
//     alignment_horizontal(worksheet, 'I36', 'center');
//     bg_color(worksheet, 'K36', 'BF9000');
//     font_bold_size_color(worksheet, 'K36', 12, 'FFFFFF');
//     alignment_horizontal(worksheet, 'K36', 'center');
//     bg_color(worksheet, 'M36', '8496B0');
//     font_bold_size_color(worksheet, 'M36', 12, 'FFFFFF');
//     alignment_horizontal(worksheet, 'M36', 'center');
//   }

//   /**
//    * 優惠券分析
//    * @param data
//    * @returns
//    */
//   async couponTest(data) {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('優惠券分析');

//     // 需要合併儲存格的欄位
//     const columnRanges = [
//       ['A1', 'L1'],
//       ['A35', 'N35'],
//       ['A36', 'B37'],
//       ['C36', 'C37'],
//       ['D36', 'D37'],
//       ['E36', 'E37'],
//       ['F36', 'F37'],
//       ['G36', 'G37'],
//       ['H36', 'H37'],
//       ['I36', 'J36'],
//       ['K36', 'L36'],
//       ['M36', 'N36'],
//       ['A38', 'B38'],
//       ['A39', 'B39'],
//       ['A40', 'B40'],
//       ['A41', 'B41'],
//       ['A42', 'B42'],
//       ['A43', 'B43'],
//       ['A44', 'B44'],
//       ['A45', 'B45'],
//       ['A46', 'B46'],
//       ['A47', 'B47'],
//       ['A48', 'B48'],
//       ['A49', 'B49'],
//       ['A50', 'B50'],
//       ['A51', 'B51'],
//       ['A52', 'B52'],
//       ['A53', 'B53'],
//       ['A54', 'B54'],
//       ['A55', 'B55'],
//       ['A56', 'B56']
//     ];
//     for (const [startCell, endCell] of columnRanges) {
//       mergeCells(worksheet, `${startCell}:${endCell}`);
//     }

//     width(worksheet, `A`, 16);
//     width(worksheet, `B`, 13);
//     width(worksheet, `C`, 11);
//     width(worksheet, `D`, 12);
//     width(worksheet, `E`, 12);
//     width(worksheet, `F`, 12);
//     width(worksheet, `G`, 12);
//     width(worksheet, `H`, 16);
//     width(worksheet, `I`, 12);
//     width(worksheet, `J`, 12);
//     width(worksheet, `K`, 12);
//     width(worksheet, `L`, 12);
//     width(worksheet, `M`, 12);
//     width(worksheet, `N`, 12);
//     value(worksheet, 'A1', '5. 優惠券');
//     font_bold_size(worksheet, 'A1', 18);

//     await this.couponPointRange(worksheet, data?.couponPointRangeValue);

//     const dir = __dirname;
//     const fileName = 'excelDemo.xlsx';

//     // 將工作簿寫入檔案
//     workbook.xlsx
//       .writeFile(`${dir}/${fileName}`)
//       .then(function () {
//         console.log('檔案已儲存');
//       })
//       .catch(function (error) {
//         console.log('發生錯誤：', error);
//       });

//     return { dir, fileName };
//   }

//   /**
//    * 創建柱狀圖並塞進 Excel
//    * @param worksheet
//    */
//   async genderBarImage(
//     workbook: ExcelJS.Workbook,
//     worksheet: ExcelJS.Worksheet,
//     data
//   ) {
//     value(worksheet, 'A3', '▲性別年齡分析');
//     font_bold_size(worksheet, 'A3', 18);

//     let row = 4;
//     for (const detail of data) {
//       value(worksheet, `A${row}`, detail?.name);
//       font_size(worksheet, `A${row}`, 12);

//       const configuration: ChartConfiguration = {
//         type: 'bar',
//         data: {
//           labels: [
//             '18-20',
//             '21-25',
//             '26-30',
//             '31-35',
//             '36-40',
//             '41-45',
//             '46-50',
//             '51-55',
//             '56-60',
//             '61-65',
//             '66-70',
//             '70 ↑'
//           ],
//           datasets: [
//             {
//               label: '男',
//               data: detail?.man,
//               backgroundColor: [
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(54, 162, 235, 0.2)'
//               ],
//               borderColor: [
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(54, 162, 235, 1)'
//               ],
//               borderWidth: 1,
//               datalabels: {
//                 color: 'black',
//                 font: {
//                   weight: 'bold'
//                 },
//                 anchor: 'end',
//                 align: 'top',
//                 offset: 3,
//                 formatter: (value, context) => {
//                   return `${value}%`;
//                 }
//               }
//             },
//             {
//               label: '女',
//               data: detail?.female,
//               backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(255, 99, 132, 0.2)'
//               ],
//               borderColor: [
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)',
//                 'rgba(255,99,132,1)'
//               ],
//               borderWidth: 1,
//               datalabels: {
//                 color: 'black',
//                 font: {
//                   weight: 'bold'
//                 },
//                 anchor: 'end',
//                 align: 'top',
//                 offset: 3,
//                 formatter: (value, context) => {
//                   return `${value}%`;
//                 }
//               }
//             },
//             {
//               label: '保密',
//               data: detail?.secret,
//               backgroundColor: [
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(255, 206, 86, 0.2)'
//               ],
//               borderColor: [
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(255, 206, 86, 1)'
//               ],
//               borderWidth: 1,
//               datalabels: {
//                 color: 'black',
//                 font: {
//                   weight: 'bold'
//                 },
//                 anchor: 'end',
//                 align: 'top',
//                 offset: 3,
//                 formatter: (value, context) => {
//                   return `${value}%`;
//                 }
//               }
//             }
//           ]
//         },
//         options: {
//           scales: {
//             y: {
//               beginAtZero: true
//             }
//           }
//         },
//         plugins: [
//           {
//             id: 'background-colour',
//             beforeDraw: (chart) => {
//               const ctx = chart.ctx;
//               ctx.save();
//               ctx.fillStyle = 'white';
//               ctx.fillRect(0, 0, widthPx, heightPx);
//               ctx.restore();
//             }
//           }
//         ]
//       } as any;

//       const widthPx = 1500; //px
//       const heightPx = 700; //px
//       const canvasRenderService = new ChartJSNodeCanvas({
//         width: widthPx,
//         height: heightPx,
//         plugins: {
//           modern: ['chartjs-plugin-datalabels']
//         }
//       });

//       const buffer = await canvasRenderService.renderToBuffer(configuration);

//       const imageId = workbook.addImage({
//         buffer,
//         extension: 'png'
//       });

//       worksheet.addImage(imageId, `A${row + 1}:N${row + 21}`);

//       row += 24;
//     }

//     return row;
//   }

//   async cityZipAnalyze(worksheet: ExcelJS.Worksheet, row) {
//     value(worksheet, `A${row}`, '▲居住縣市分析');
//     font_bold_size(worksheet, `A${row}`, 18);
//   }

//   /**
//    * 會員輪廓分析
//    * @param data
//    * @returns
//    */
//   async memberInfoTest(data) {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('會員輪廓分析');

//     // 需要合併儲存格的欄位
//     const columnRanges = [['A1', 'M1']];
//     for (const [startCell, endCell] of columnRanges) {
//       mergeCells(worksheet, `${startCell}:${endCell}`);
//     }

//     width(worksheet, `A`, 16);
//     width(worksheet, `B`, 15);
//     width(worksheet, `C`, 14);
//     width(worksheet, `D`, 15);
//     width(worksheet, `E`, 15);
//     width(worksheet, `F`, 15);
//     width(worksheet, `G`, 15);
//     width(worksheet, `H`, 15);
//     width(worksheet, `I`, 15);
//     width(worksheet, `J`, 15);
//     width(worksheet, `K`, 15);
//     width(worksheet, `L`, 15);
//     width(worksheet, `M`, 15);
//     value(
//       worksheet,
//       'A1',
//       '6. 會員輪廓分析 (一季提供一次，4月初提供Q1、7月初提供Q2，以此類推；一年提供全年，2025年1月初額外提供2024全年)'
//     );
//     font_bold_size(worksheet, 'A1', 18);

//     const d = [
//       {
//         name: '總會員',
//         man: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//         female: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
//         secret: [6, 5, 4, 3, 2, 1, 7, 8, 9, 10, 11, 12]
//       },
//       {
//         name: '饗饗',
//         man: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
//         female: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//         secret: [6, 5, 4, 3, 2, 1, 7, 8, 9, 10, 11, 12]
//       },
//       {
//         name: '續集',
//         man: [6, 5, 4, 3, 2, 1, 7, 8, 9, 10, 11, 12],
//         female: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
//         secret: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
//       }
//     ];
//     // 性別年齡分析
//     const row = await this.genderBarImage(workbook, worksheet, d);
//     // 品牌 柱狀圖
//     // await this.cityZipAnalyze(workbook,d);

//     const dir = __dirname;
//     const fileName = 'excelDemo.xlsx';

//     // 將工作簿寫入檔案
//     workbook.xlsx
//       .writeFile(`${dir}/${fileName}`)
//       .then(function () {
//         console.log('檔案已儲存');
//       })
//       .catch(function (error) {
//         console.log('發生錯誤：', error);
//       });

//     return { dir, fileName };
//   }
// }

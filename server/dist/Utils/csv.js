"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function generateCsv(CsvGenerateConfig) {
    const { rowConfig, data, fileName, dir } = CsvGenerateConfig;
    const configLength = rowConfig.length;
    const header = rowConfig.reduce((acc, crr, index) => {
        if (index !== 0)
            acc += ",";
        acc += `${crr.title}`;
        if (index === configLength - 1)
            acc += "\n";
        return acc;
    }, "");
    const content = data.reduce((accStr, rowData) => {
        const rowStr = rowConfig.reduce((acc, crr, index) => {
            if (index !== 0)
                acc += ",";
            if (crr.render) {
                acc += `${crr.render(rowData, index)}`;
            }
            else {
                acc += `${rowData[crr.key]}`;
            }
            if (index === configLength - 1)
                acc += "\n";
            return acc;
        }, "");
        accStr += rowStr;
        return accStr;
    }, "");
    const csvStr = header + content;
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/${fileName}`, `\ufeff${csvStr}`, "utf8");
}
exports.default = generateCsv;
//# sourceMappingURL=csv.js.map
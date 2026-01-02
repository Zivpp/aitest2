import * as ExcelJS from "exceljs";
export declare const floorToDecimal: (value: number, decimalPlaces: number) => number;
export declare const value: (worksheet: ExcelJS.Worksheet, column: string, value: string | number) => string | number;
export declare const getValue: (worksheet: ExcelJS.Worksheet, column: string) => ExcelJS.CellValue;
export declare const width: (worksheet: ExcelJS.Worksheet, column: string, width: number) => number;
export declare const font_bold: (worksheet: ExcelJS.Worksheet, column: string) => {
    bold: true;
    name: string;
};
export declare const font_color: (worksheet: ExcelJS.Worksheet, column: string, color: string) => {
    color: {
        argb: string;
    };
    name: string;
};
export declare const font_bold_color: (worksheet: ExcelJS.Worksheet, column: string, color: string) => {
    bold: true;
    color: {
        argb: string;
    };
    name: string;
};
export declare const font_size_color: (worksheet: ExcelJS.Worksheet, column: string, size: number, color: string) => {
    size: number;
    color: {
        argb: string;
    };
    name: string;
};
export declare const font_bold_size: (worksheet: ExcelJS.Worksheet, column: string, size: number) => {
    bold: true;
    size: number;
    name: string;
};
export declare const font_bold_size_color: (worksheet: ExcelJS.Worksheet, column: string, size: number, color: string) => {
    bold: true;
    size: number;
    color: {
        argb: string;
    };
    name: string;
};
export declare const bg_color: (worksheet: ExcelJS.Worksheet, column: string, color: string) => {
    type: "pattern";
    pattern: "solid";
    fgColor: {
        argb: string;
    };
};
export declare const font_size: (worksheet: ExcelJS.Worksheet, column: string, size: number) => {
    size: number;
    name: string;
};
export declare const alignment_horizontal: (worksheet: ExcelJS.Worksheet, column: string, position: ExcelJS.Alignment["horizontal"]) => {
    horizontal: "fill" | "left" | "center" | "right" | "justify" | "centerContinuous" | "distributed";
    vertical: "middle";
};
export declare const numFmt: (worksheet: ExcelJS.Worksheet, column: string, type: string) => string;
export declare const mergeCells: (worksheet: ExcelJS.Worksheet, startEndCell: string) => void;
export declare const border: (worksheet: ExcelJS.Worksheet, column: string, changeStypePosition?: string[], style?: string) => any;
export declare const border_cust: (worksheet: ExcelJS.Worksheet, column: string, border: any) => any;
export declare const richText: (worksheet: ExcelJS.Worksheet, column: string, value: string[]) => {
    richText: {
        text: string;
    }[];
};

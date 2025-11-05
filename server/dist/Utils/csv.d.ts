declare function generateCsv<T>(CsvGenerateConfig: CsvGenerateConfig<T>): void;
export interface CsvGenerateConfig<T> {
    rowConfig: Array<{
        key: string;
        title: string;
        render?: (data: T, index: number) => string | number;
    }>;
    data: Array<T>;
    fileName: string;
    dir: string;
}
export default generateCsv;

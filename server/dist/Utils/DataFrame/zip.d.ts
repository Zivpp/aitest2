export declare class ConvertZip {
    filesCompression(zipFolderPath: string, zipFilePath: string, filesPath: string): Promise<void>;
    filesCompressionForPassword(zipFolderPath: string, zipFilePath: string, filesPath: string, filePassword: string): Promise<void>;
}

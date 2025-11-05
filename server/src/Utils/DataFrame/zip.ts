import * as fs from "fs";
const path = require("path");
const archiver = require("archiver");
archiver.registerFormat("zip-encrypted", require("archiver-zip-encrypted"));

export class ConvertZip {
  /**
   * 檔案壓縮
   *
   * @param zipFolderPath
   * @param zipFilePath
   * @param filesPath
   */
  async filesCompression(
    zipFolderPath: string,
    zipFilePath: string,
    filesPath: string,
  ) {
    // 指定位置
    if (!fs.existsSync(zipFolderPath)) fs.mkdirSync(zipFolderPath);
    const output = fs.createWriteStream(zipFilePath);

    // 创建一个 archiver 实例
    const archive = archiver("zip", {
      zlib: { level: 9 }, // 设置压缩级别
    });

    // 将 ZIP 文件写入到可写流中
    archive.pipe(output);

    // 遍历文件夹中的所有文件
    fs.readdirSync(filesPath).forEach((file) => {
      // 获取文件的完整路径
      const filePath = path.join(filesPath, file);

      // 将 Excel 文件添加到 ZIP 文件中
      archive.file(filePath, { name: file });
    });

    // 完成压缩并关闭可写流
    archive.finalize();

    // 等待压缩完成
    await new Promise<void>((resolve, reject) => {
      output.on("close", () => {
        resolve();
      });
      archive.on("error", (err) => {
        reject(err);
      });
    });
  }

  /**
   * 壓縮檔案 設置密碼
   *
   * @param zipFolderPath
   * @param zipFilePath
   * @param filesPath
   * @param filePassword
   */
  async filesCompressionForPassword(
    zipFolderPath: string,
    zipFilePath: string,
    filesPath: string,
    filePassword: string,
  ) {
    // 指定位置
    if (!fs.existsSync(zipFolderPath)) fs.mkdirSync(zipFolderPath);

    const output = fs.createWriteStream(zipFilePath);

    // 创建一个 archiver 实例
    const archive = archiver.create("zip-encrypted", {
      zlib: { level: 9 }, // 设置压缩级别
      encryptionMethod: "aes256",
      password: filePassword, // 密碼
    });

    // 将 ZIP 文件写入到可写流中
    archive.pipe(output);

    // 遍历文件夹中的所有文件
    fs.readdirSync(filesPath).forEach((file) => {
      // 获取文件的完整路径
      const filePath = path.join(filesPath, file);

      // 将 Excel 文件添加到 ZIP 文件中
      archive.file(filePath, { name: file });
    });

    // 完成压缩并关闭可写流
    archive.finalize();

    // 等待压缩完成
    await new Promise<void>((resolve, reject) => {
      output.on("close", () => {
        resolve();
      });
      archive.on("error", (err) => {
        reject(err);
      });
    });
  }
}

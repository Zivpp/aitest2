"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertZip = void 0;
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
archiver.registerFormat("zip-encrypted", require("archiver-zip-encrypted"));
class ConvertZip {
    async filesCompression(zipFolderPath, zipFilePath, filesPath) {
        if (!fs.existsSync(zipFolderPath))
            fs.mkdirSync(zipFolderPath);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver("zip", {
            zlib: { level: 9 },
        });
        archive.pipe(output);
        fs.readdirSync(filesPath).forEach((file) => {
            const filePath = path.join(filesPath, file);
            archive.file(filePath, { name: file });
        });
        archive.finalize();
        await new Promise((resolve, reject) => {
            output.on("close", () => {
                resolve();
            });
            archive.on("error", (err) => {
                reject(err);
            });
        });
    }
    async filesCompressionForPassword(zipFolderPath, zipFilePath, filesPath, filePassword) {
        if (!fs.existsSync(zipFolderPath))
            fs.mkdirSync(zipFolderPath);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver.create("zip-encrypted", {
            zlib: { level: 9 },
            encryptionMethod: "aes256",
            password: filePassword,
        });
        archive.pipe(output);
        fs.readdirSync(filesPath).forEach((file) => {
            const filePath = path.join(filesPath, file);
            archive.file(filePath, { name: file });
        });
        archive.finalize();
        await new Promise((resolve, reject) => {
            output.on("close", () => {
                resolve();
            });
            archive.on("error", (err) => {
                reject(err);
            });
        });
    }
}
exports.ConvertZip = ConvertZip;
//# sourceMappingURL=zip.js.map
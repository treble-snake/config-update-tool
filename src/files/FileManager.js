const fs = require('fs');
const util = require('util');
const path = require('path');
const fsExtra = require('fs-extra');
const pathType = require('path-type');

const cwd = process.cwd();
const fsAccessAsync = util.promisify(fs.access);

class FileManager {

  /**
   * @param {string} filePath
   * @return {string}
   */
  static getFullPath(filePath) {
    return path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  }

  /**
   * @param {string} filePath
   * @param {string[]} allowed
   */
  static isExtAllowed(filePath, allowed) {
    return allowed.includes(path.extname(filePath));
  }

  /**
   * @param {string} filePath
   * @return {boolean}
   */
  static isFileSync(filePath) {
    return pathType.fileSync(FileManager.getFullPath(filePath));
  }

  /**
   * @param {string} filePath
   * @return {Promise.<boolean>}
   */
  static isFile(filePath) {
    return pathType.file(FileManager.getFullPath(filePath));
  }

  /**
   * @param {string} filePath
   * @throws {Error}
   */
  static async ensureOutputPath(filePath) {
    const dir = path.dirname(FileManager.getFullPath(filePath));

    // will throw an exception on failure
    await fsExtra.ensureDir(dir);

    // check if dir is writable
    await fsAccessAsync(dir, fs.constants.W_OK); // TODO test on unix
  }

  /**
   * @param {string} filePath
   * @throws {Error}
   */
  static ensureOutputPathSync(filePath) {
    const dir = path.dirname(FileManager.getFullPath(filePath));

    // will throw an exception on failure
    fsExtra.ensureDirSync(dir);

    // check if dir is writable
    fs.accessSync(dir, fs.constants.W_OK); // TODO test on unix
  }

  /**
   * @param {string} relativePath
   * @param {boolean} write
   * @return {boolean}
   */
  static fileExistsSync(relativePath, write = false) {
    try {
      fs.accessSync(FileManager.getFullPath(relativePath),
        write ? fs.constants.W_OK : fs.constants.R_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {string} relativePath
   * @param {boolean} write
   * @return {Promise<boolean>}
   */
  static async fileExists(relativePath, write = false) {
    try {
      await fsAccessAsync(FileManager.getFullPath(relativePath),
        write ? fs.constants.W_OK : fs.constants.R_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async createBackup(relativePath) {
    const fileExists = await
      FileManager.fileExists(relativePath);
    if (!fileExists) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const filenameParts = path.basename(relativePath).split('.');
      const backupFilename = filenameParts.slice(0, -1)
        .concat(Date.now(), filenameParts.slice(-1), 'bak')
        .join('.');
      const backupFileRelativePath =
        path.join(path.dirname(relativePath), backupFilename);

      // TODO ensure encoding
      const readStream = fs.createReadStream(relativePath, {encoding: 'utf-8'});
      const writeStream = fs.createWriteStream(
        backupFileRelativePath, {encoding: 'utf-8'});

      readStream.on('error', err => reject(err));
      writeStream.on('error', err => reject(err));
      writeStream.on('close', () => resolve(backupFilename));

      readStream.pipe(writeStream);
    });
  }
}

module.exports = FileManager;
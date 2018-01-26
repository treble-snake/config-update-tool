const fsExtra = require('fs-extra');
const util = require('util');
const FileManager = require('../../files/FileManager');
const OutputAdapterBase = require('./OutputAdapterBase');

class JsonAdapter extends OutputAdapterBase {

  static _makeString(data) {
    return `module.exports = ${util.inspect(data, false, null)};`;
  }

  async write(data, file) {
    return fsExtra.outputFile(
      FileManager.getFullPath(file), JsonAdapter._makeString(data));
  }
}

module.exports = JsonAdapter;
const fsExtra = require('fs-extra');
const FileManager = require('../../files/FileManager');
const OutputAdapterBase = require('./OutputAdapterBase');

class JsonAdapter extends OutputAdapterBase {

  async write(data, file) {
    return fsExtra.outputJson(FileManager.getFullPath(file), data, {
      spaces: 2,
      replacer: null
    });
  }
}

module.exports = JsonAdapter;
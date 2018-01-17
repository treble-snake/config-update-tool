const InputAdapterBase = require('./InputAdapterBase');
const FileManager = require('../../files/FileManager');

class JsJsonAdatper extends InputAdapterBase {
  parse(file) {
    return require(FileManager.getFullPath(file));
  }
}

module.exports = JsJsonAdatper;
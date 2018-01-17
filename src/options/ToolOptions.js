const OPTIONS_LIST = Object.freeze({
  mode: 'mode',
  inputFile: 'inputFile',
  outputFile: 'outputFile',
  backupRequired: 'backupRequired'
});

class ToolOptions {
  constructor() {
    this.inputFile = null;
    this.outputFile = null;
    this.mode = null;
    this.backupRequired = false;
  }

  static list() {
    return OPTIONS_LIST;
  }
}

module.exports = ToolOptions;
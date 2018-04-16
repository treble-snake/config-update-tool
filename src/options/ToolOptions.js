const {isBoolean} = require('lodash');
const FileManager = require('../files/FileManager');
const {
  ALLOWED_INPUT,
  ALLOWED_OUTPUT,
  MODES
} = require('./Constants');

const OPTIONS_LIST = Object.freeze({
  mode: 'mode',
  inputFile: 'inputFile',
  outputFile: 'outputFile',
  backupRequired: 'backupRequired',
  isForce: 'isForce'
});

/**
 * Options defining tool's behaviour
 */
class ToolOptions {
  /**
   * @param {Object} [defaults={}] - initial values for the options
   * @param {string} [defaults.mode] - work mode (create or merge)
   * @param {string} [defaults.inputFile] - absolute or relative to cwd path to
   * the input config template file
   * @param {string} [defaults.outputFile] - absolute or relative to cwd path to
   * the config output file
   * @param {boolean} [defaults.backupRequired] - if true, tool will make attempt
   * to create a backup copy of the output file
   * @param {boolean} [defaults.isForce] - if true, tool won't ask for user prompt and use defaults from template
   */
  constructor(defaults = {}) {
    /**
     * Work mode (create or merge)
     * @type {string|null}
     */
    this.mode = defaults.mode || null;

    /**
     * Absolute or relative to cwd path to the input config template file
     * @type {string|null}
     */
    this.inputFile = defaults.inputFile || null;

    /**
     * Absolute or relative to cwd path to the config output file
     * @type {string|null}
     */
    this.outputFile = defaults.outputFile || null;

    /**
     * If true, tool will make attempt to create a backup copy of the output file
     * @type {boolean|null}
     */
    this.backupRequired = isBoolean(defaults.backupRequired) ?
      defaults.backupRequired : null;

    this.isForce = isBoolean(defaults.isForce) ?
      defaults.isForce : null;
  }

  static list() {
    return OPTIONS_LIST;
  }

  static async validateInputFile(file) {
    if (!await FileManager.isFile(file)) {
      throw new Error('Input file doesn\'t exist');
    }

    if (!FileManager.isExtAllowed(file, ALLOWED_INPUT)) {
      throw new Error('Input file extension is not supported');
    }
  }

  static validateInputFileSync(file) {
    if (!FileManager.isFileSync(file)) {
      throw new Error('Input file doesn\'t exist');
    }

    if (!FileManager.isExtAllowed(file, ALLOWED_INPUT)) {
      throw new Error('Input file extension is not supported');
    }
  }

  static validateOutputFileSync(file) {
    if (FileManager.fileExistsSync(file, true)) {
      return;
    }

    FileManager.ensureOutputPathSync(file);
    if (!FileManager.isExtAllowed(file, ALLOWED_OUTPUT)) {
      throw new Error('Output file extension is not supported');
    }
  }

  static async validateOutputFile(file) {
    if (await FileManager.fileExists(file, true)) {
      return;
    }

    await FileManager.ensureOutputPath(file);
    if (!FileManager.isExtAllowed(file, ALLOWED_OUTPUT)) {
      throw new Error('Output file extension is not supported');
    }
  }

  static validateMode(mode) {
    if (!Object.values(MODES).includes(mode)) {
      throw new Error(`Mode value ${mode} is not allowed`);
    }
  }

  static validateBackupRequired(value) {
    if (!isBoolean(value)) {
      throw new Error('Backup required option should be boolean');
    }
  }
  static validateIsForce(value) {
    if (!isBoolean(value)) {
      throw new Error('Force flag option should be boolean');
    }
  }

  async validateFilledOptions() {
    await (this.inputFile !== null && ToolOptions.validateInputFile(this.inputFile));
    await (this.outputFile !== null && ToolOptions.validateOutputFile(this.outputFile));
    this.mode !== null && ToolOptions.validateMode(this.mode);
    this.backupRequired !== null &&
      ToolOptions.validateBackupRequired(this.backupRequired);
    this.isForce !== null &&
      ToolOptions.validateIsForce(this.isForce);
  }
}

module.exports = ToolOptions;
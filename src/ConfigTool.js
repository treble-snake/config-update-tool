const chalk = require('chalk');
const util = require('util');
const debug = require('debug')('config-tool');

const OptionManager = require('./options/OptionManager');
const FileManager = require('./files/FileManager');
const AdapterRegistry = require('./adapters/AdapterRegistry');
const ConfigEditor = require('./editor/ConfigEditor');

const {MODES} = require('./options/Constants');

/**
 * Main class of the tool
 */
class ConfigTool {

  /**
   * Initiates config updating process
   * @param {ToolOptions} [options] - this values will NOT be overwritten with
   * command line options
   * @return {Promise<void>}
   */
  static async run(options) {
    const tool = new ConfigTool();
    await tool.run(options);
  }

  /**
   * Initiates config updating process
   * @param {ToolOptions} [options] - this values will NOT be overwritten with
   * command line options
   * @return {Promise<void>}
   */
  async run(options) {
    console.log(chalk.blue(`Working from: ${process.cwd()} (you can enter paths relative to this)`));

    options = await (new OptionManager(options)).configure();
    const {inputFile, outputFile, mode, backupRequired, isForce} = options;

    console.log(chalk.blue(`\nRunning with options: ${JSON.stringify(options, null, '\t')}`));

    const editor = new ConfigEditor(isForce);
    const result = await (mode === MODES.merge ?
      editor.merge(inputFile, outputFile) :
      editor.create(inputFile));

    debug('Result: %s', util.inspect(result, false, null, true));

    // create backup
    let backupFilename;
    if (backupRequired) {
      backupFilename = await FileManager.createBackup(outputFile);
    }

    const outputAdapter = AdapterRegistry.getOutputAdapter(outputFile);
    await outputAdapter.write(result, outputFile);

    console.log(chalk.blue(`\nDone!\nConfig has been written to ${outputFile}.`));
    if (backupFilename) {
      console.log(chalk.blue(`Backup created in: ${backupFilename}`));
    }
  }
}

module.exports = ConfigTool;
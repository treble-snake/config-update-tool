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
   * @return {Promise<void>}
   */
  static async run() {
    const tool = new ConfigTool();
    await tool.run();
  }

  /**
   * @return {Promise<void>}
   */
  async run() {
    console.log(chalk.blue(`Working from: ${process.cwd()} (you can enter paths relative to this)`));

    const options = await (new OptionManager()).configure();
    const {inputFile, outputFile, mode, backupRequired} = options;

    console.log(chalk.blue(`\nRunning with options: ${JSON.stringify(options, null, '\t')}`));

    const editor = new ConfigEditor();
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
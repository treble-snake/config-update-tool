const inquirer = require('inquirer');
const ToolOptions = require('./ToolOptions');
const CmdArgsParser = require('./CmdArgsParser');

const {CMD_OPTIONS} = require('./Constants');
const {QUESTIONS_SET} = require('./InquirerQuestions');

const PARSED_ARGS = CmdArgsParser.parse();
const OPTION_LIST = ToolOptions.list();
const OPTIONS_MAPPING = {
  [CMD_OPTIONS.mode]: OPTION_LIST.mode,
  [CMD_OPTIONS.input]: OPTION_LIST.inputFile,
  [CMD_OPTIONS.output]: OPTION_LIST.outputFile,
  [CMD_OPTIONS.backup]: OPTION_LIST.backupRequired
};

class OptionsManager {

  /**
   * @param {ToolOptions|Object} options
   */
  constructor(options) {
    this.options = options instanceof ToolOptions ?
      options : new ToolOptions(options);
  }

  _parseCommandLineOptions() {
    Object.values(CMD_OPTIONS)
      .filter(name => this.options[OPTIONS_MAPPING[name]] === null)
      .forEach(name => {
        this.options[OPTIONS_MAPPING[name]] = PARSED_ARGS[name];
      });
  }

  async _getOptionsFromUser() {
    const questions = Object.keys(QUESTIONS_SET)
      .filter(key => this.options[key] === null)
      .map(key => QUESTIONS_SET[key]);
    if (questions.length === 0) {
      return;
    }

    const answers = await inquirer.prompt(questions);
    Object.keys(answers).forEach(key => {
      this.options[key] = answers[key];
    });
  }

  /**
   * @return {Promise<ToolOptions>}
   */
  async configure() {
    await this.options.validateFilledOptions();
    await this._parseCommandLineOptions();
    await this._getOptionsFromUser();

    return this.options;
  }
}

module.exports = OptionsManager;
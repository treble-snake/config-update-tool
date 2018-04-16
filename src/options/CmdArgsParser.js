const yargs = require('yargs');
const ToolOptions = require('../options/ToolOptions');

const {
  MODES,
  CMD_OPTIONS
} = require('./Constants');

class CmdArgsParser {
  static parse() {

    return yargs
      .usage(`Usage: config-update-tool [--${CMD_OPTIONS.mode} <mode>] [--${CMD_OPTIONS.input} <path>] \
[--${CMD_OPTIONS.output} <path>] [--${CMD_OPTIONS.backup}] [--${CMD_OPTIONS.force}]`)
      .boolean(CMD_OPTIONS.backup)
      .boolean(CMD_OPTIONS.force)
      .string(CMD_OPTIONS.input)
      .string(CMD_OPTIONS.output)
      .choices(CMD_OPTIONS.mode, Object.values(MODES).concat(null))

      .default('m', null)
      .default('o', null)
      .default('b', null)
      .default('i', null)
      .default('f', null)

      .coerce('i', value => {
        if (value === null) {
          return null;
        }
        ToolOptions.validateInputFileSync(value);
        return value;
      })
      .coerce('o', value => {
        if (value === null) {
          return null;
        }
        ToolOptions.validateOutputFileSync(value);
        return value;
      })

      .describe('m', 'Usage mode: `create` for new config file and `merge` for modifying existing one')
      .describe('i', 'Path to the input file')
      .describe('o', 'Path to the output file')
      .describe('b', 'Make a backup of the output file')
      .describe('no-b', 'Don\'t make a backup of the output file')
      .describe('f', 'Tool won\'t ask for user prompt and use template values')
      .describe('no-f', 'Tool will ask for user prompt')

      .alias('m', CMD_OPTIONS.mode)
      .alias('i', CMD_OPTIONS.input)
      .alias('o', CMD_OPTIONS.output)
      .alias('b', CMD_OPTIONS.backup)
      .alias('f', CMD_OPTIONS.force)

      .parse();
  }
}

module.exports = CmdArgsParser;
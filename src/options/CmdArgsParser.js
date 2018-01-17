const yargs = require('yargs');
const FileManager = require('../files/FileManager');

const {
  ALLOWED_INPUT,
  ALLOWED_OUTPUT,
  MODES,
  CMD_OPTIONS
} = require('./Constants');

class CmdArgsParser {
  static parse() {

    return yargs
      .usage(`Usage: npm start -- [--${CMD_OPTIONS.mode} <mode>] [--${CMD_OPTIONS.input} <path>] \
[--${CMD_OPTIONS.output} <path>] [--${CMD_OPTIONS.backup}]`)
      .boolean(CMD_OPTIONS.backup)
      .string(CMD_OPTIONS.input)
      .string(CMD_OPTIONS.output)
      .choices(CMD_OPTIONS.mode, Object.values(MODES).concat(null))

      .default('m', null)
      .default('o', null)
      .default('b', null)
      .default('i', null)

      .coerce('i', value => {
        if (value === null) {
          return null;
        }

        if (!FileManager.isFileSync(value)) {
          throw new Error('Input file doesn\'t exist');
        }

        if (!FileManager.isExtAllowed(value, ALLOWED_INPUT)) {
          throw new Error('Input file extension is not supported');
        }

        return value;
      })
      .coerce('o', value => {
        if (value === null) {
          return null;
        }

        FileManager.ensureOutputPathSync(value);
        if (!FileManager.isExtAllowed(value, ALLOWED_OUTPUT)) {
          throw new Error('Output file extension is not supported');
        }

        return value;
      })

      .describe('m', 'Usage mode: `create` for new config file and `merge` for modifying existing one')
      .describe('o', 'Path to the output file')
      .describe('b', 'Make a backup of the output file')
      .describe('i', 'Path to the input file')
      .describe('no-b', 'Don\'t make a backup of the output file')

      .alias('m', CMD_OPTIONS.mode)
      .alias('o', CMD_OPTIONS.output)
      .alias('b', CMD_OPTIONS.backup)
      .alias('i', CMD_OPTIONS.input)

      .parse();
  }
}

module.exports = CmdArgsParser;
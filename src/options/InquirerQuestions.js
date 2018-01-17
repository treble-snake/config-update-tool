const FileManager = require('../files/FileManager');
const ToolOptions = require('./ToolOptions');

const {
  ALLOWED_INPUT,
  ALLOWED_OUTPUT,
  MODES
} = require('./Constants');

const OPTION_LIST = ToolOptions.list();

function choice(value, name, short) {
  return {name, value, short: short || name};
}

function getFileValidator(write = false) {
  return async (value) => {
    if (!value) {
      return 'Enter correct path';
    }

    // for writing request
    if (write) {
      if (await FileManager.fileExists(value, true)) {
        return true;
      }

      try {
        FileManager.ensureOutputPathSync(value);
        if (!FileManager.isExtAllowed(value, ALLOWED_OUTPUT)) {
          return 'Output file extension is not supported';
        }

        return true;
      } catch (e) {
        return e.message;
      }
    }

    // for reading request
    else {
      if (!await FileManager.isFile(value)) {
        return 'Input file doesn\'t exist';
      }

      if (!FileManager.isExtAllowed(value, ALLOWED_INPUT)) {
        return 'Input file extension is not supported';
      }

      return true;
    }
  };
}

const QUESTIONS_SET = {
  [OPTION_LIST.mode]: {
    type: 'list',
    name: OPTION_LIST.mode,
    message: 'Choose mode:',
    choices: [
      choice(MODES.create, 'Create new config'),
      choice(MODES.merge, 'Merge configs')
    ],
    default: 0
  },
  [OPTION_LIST.inputFile]: {
    name: OPTION_LIST.inputFile,
    message: 'Enter path to input config file',
    validate: getFileValidator(false)
  },
  [OPTION_LIST.outputFile]: {
    name: OPTION_LIST.outputFile,
    message: 'Enter path to output config file',
    validate: getFileValidator(true)
  },
  [OPTION_LIST.backupRequired]: {
    name: OPTION_LIST.backupRequired,
    message: 'Is backup of existing output required',
    type: 'list',
    choices: [
      choice(true, 'Yes'),
      choice(false, 'No')
    ],
    default: 0
  }
};

module.exports = {QUESTIONS_SET};
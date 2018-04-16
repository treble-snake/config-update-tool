const ToolOptions = require('./ToolOptions');

const {
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
      await ToolOptions.validateOutputFile(value);
      return true;
    }
    // for reading request
    else {
      await ToolOptions.validateInputFile(value);
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
  },
  [OPTION_LIST.isForce]: {
    name: OPTION_LIST.isForce,
    message: 'Use template values and don\'t ask for user prompt',
    type: 'list',
    choices: [
      choice(true, 'Yes'),
      choice(false, 'No')
    ],
    default: 1
  }
};

module.exports = {QUESTIONS_SET};
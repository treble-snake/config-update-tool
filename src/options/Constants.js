const AdapterRegistry = require('../adapters/AdapterRegistry');

module.exports = {
  ALLOWED_INPUT: AdapterRegistry.listAvailableInputExtensions(),
  ALLOWED_OUTPUT: AdapterRegistry.listAvailableOutputExtensions(),

  MODES: {
    merge: 'merge',
    create: 'create'
  },

  CMD_OPTIONS: {
    mode: 'mode',
    input: 'input',
    output: 'output',
    backup: 'backup'
  }
};
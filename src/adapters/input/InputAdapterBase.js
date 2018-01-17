class InputAdapterBase {
  /**
   * @param {string} file
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  parse(file) {
    throw new Error('Not implemented');
  }
}

module.exports = InputAdapterBase;
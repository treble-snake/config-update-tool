class OutputAdapterBase {
  // eslint-disable-next-line no-unused-vars
  async write(data, file) {
    throw new Error('Not implemented');
  }
}

module.exports = OutputAdapterBase;
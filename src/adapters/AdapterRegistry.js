const path = require('path');

const JsJsonInputAdapter = require('./input/JsJsonAdatper');
const JsonOutputAdapter = require('./output/JsonAdapter');
const JsOutputAdapter = require('./output/JsAdapter');

class AdapterRegistry {
  constructor() {
    this.inputAdapters = new Map();
    this.outputAdapters = new Map();

    const jsJsonInputAdapter = new JsJsonInputAdapter();
    this.registerInput('.js', jsJsonInputAdapter);
    this.registerInput('.json', jsJsonInputAdapter);

    this.registerOutput('.js', new JsOutputAdapter());
    this.registerOutput('.json', new JsonOutputAdapter());
  }

  registerInput(ext, adapter) {
    this.inputAdapters.set(ext, adapter);
  }

  registerOutput(ext, adapter) {
    this.outputAdapters.set(ext, adapter);
  }

  listAvailableInputExtensions() {
    return [...this.inputAdapters.keys()];
  }

  listAvailableOutputExtensions() {
    return [...this.outputAdapters.keys()];
  }

  /**
   * @param file
   * @return {InputAdapterBase}
   */
  getInputAdapter(file) {
    const ext = path.extname(file);
    return this.inputAdapters.get(ext);
  }

  /**
   * @param file
   * @return {OutputAdapterBase}
   */
  getOutputAdapter(file) {
    const ext = path.extname(file);
    return this.outputAdapters.get(ext);
  }
}

module.exports = new AdapterRegistry();
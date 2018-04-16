const _ = require('lodash');
const chalk = require('chalk');

const AdapterRegistry = require('../adapters/AdapterRegistry');
const ObjectManager = require('./ObjectManager');
const PromptFactory = require('./PromptFactory');

const ROOT_BLOCK = '[root]';

class ConfigEditor {
  /**
   * @param {boolean} [isForce=false] if true, just takes template values without user prompt
   */
  constructor(isForce = false) {
    this.isForce = isForce;
  }

  async merge(inputPath, outputPath) {
    const current = AdapterRegistry.getInputAdapter(outputPath).parse(outputPath);
    const template = AdapterRegistry.getInputAdapter(inputPath).parse(inputPath);

    return this._produceMerge(template, current);
  }

  // noinspection JSMethodCanBeStatic
  async create(inputPath) {
    const input = AdapterRegistry.getInputAdapter(inputPath).parse(inputPath);
    return (new ObjectManager(this.isForce)).fillObject(input, ROOT_BLOCK);
  }

  async _produceMerge(template, current, blockName = '[root]') {
    let result = {};
    let keys = Object.keys(template);

    for (let key of keys) {
      let content = template[key];
      const blockKey = `${blockName}.${key}`;

      if (_.isObject(content) && !Array.isArray(content)) {
        if (current.hasOwnProperty(key)) {
          result[key] = await this._produceMerge(content, current[key], blockKey);
          continue;
        }

        console.log(chalk.green(`\nNew properties' block: ${blockKey}`));
        result[key] =
          await (new ObjectManager(this.isForce)).fillObject(content, blockKey);
        continue;
      }

      if (current.hasOwnProperty(key)) {
        result[key] = current[key];
        continue;
      }

      try {
        result[key] = this.isForce ? content :
          await PromptFactory.getValue(blockKey, content);
      } catch (e) {
        result[key] = content;
        console.log(chalk.yellow(`Sorry, ${e.message}. Default value is used.`));
      }
    }

    return result;
  }
}

module.exports = ConfigEditor;
const _ = require('lodash');
const chalk = require('chalk');
const PromptFactory = require('./PromptFactory');

class ObjectManager {
  /**
   * @param {boolean} [isForce=false] if true, just takes template values without user prompt
   */
  constructor(isForce = false) {
    this.isForce = isForce;
  }

  async fillObject(template, blockName) {
    if (blockName) {
      console.log(chalk.blue(`Processing '${blockName}'`));
    }

    const result = {};
    const keys = Object.keys(template);

    for (const key of keys) {
      const templateValue = template[key];

      if (_.isObject(templateValue) && !Array.isArray(templateValue)) {
        result[key] = await this.fillObject(templateValue, `${blockName}.${key}`);
        console.log(chalk.blue(`Back to '${blockName}'`));
        continue;
      }

      try {
        result[key] = this.isForce ? templateValue :
          await PromptFactory.getValue(`${blockName}.${key}`, templateValue);
      } catch (e) {
        result[key] = templateValue;
        console.log(chalk.yellow(`Sorry, ${e.message}. Default value is used.`));
      }
    }

    if (blockName) {
      console.log(chalk.green(`Done processing '${blockName}'\n`));
    }

    return result;
  }
}

module.exports = ObjectManager;
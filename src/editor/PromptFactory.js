const inquirer = require('inquirer');
const _ = require('lodash');

const ValidatorFactory = require('./validation/ValidatorFactory');
const MapperFactory = require('./validation/MapperFactory');
const ArrayFactory = require('./array/ArrayFactory');

function choice(value, name, short) {
  return {name, value, short: short || name};
}

class PromptFactory {

  /**
   * @param key
   * @param templateValue
   * @return {Promise<boolean>}
   * @private
   */
  static async _getBoolean(key, templateValue) {
    const {value} = await inquirer.prompt({
      type: 'list',
      name: 'value',
      message: `Enter value for ${key}:`,
      choices: [
        choice(true, 'true'),
        choice(false, 'false')
      ],
      default: templateValue ? 0 : 1
    });
    return value;
  }

  /**
   * @param key
   * @param templateValue
   * @return {Promise<string|number>}
   * @private
   */
  static async _getPrimitive(key, templateValue) {
    const {value} = await inquirer.prompt({
      name: 'value',
      message: `Enter value for ${key}:`,
      default: templateValue === null ? '' : templateValue.toString(),
      validate: ValidatorFactory.choosePrimitiveValidator(templateValue),
      filter: v => MapperFactory.mapPrimitive(templateValue, v)
    });
    return value;
  }

  /**
   * @param key
   * @param {Array} templateArray
   * @return {Promise<*>}
   * @private
   */
  static async _getArray(key, templateArray) {
    return ArrayFactory.getValue(key, templateArray);
  }

  static async getValue(key, templateValue) {
    if (_.isBoolean(templateValue)) {
      return PromptFactory._getBoolean(key, templateValue);
    }

    if (Array.isArray(templateValue)) {
      return PromptFactory._getArray(key, templateValue);
    }

    return PromptFactory._getPrimitive(key, templateValue);
  }
}

module.exports = PromptFactory;
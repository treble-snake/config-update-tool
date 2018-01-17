const inquirer = require('inquirer');
const ValidatorFactory = require('../validation/ValidatorFactory');
const MapperFactory = require('../validation/MapperFactory');
const Types = require('./Types');

const VALIDATORS = {
  [Types.numbers]: {
    fn: ValidatorFactory.validateNumber,
    mapper: MapperFactory.mapToNumber,
    msg: 'Enter comma separated numbers'
  },
  [Types.booleans]: {
    fn: ValidatorFactory.validateStringBoolean,
    mapper: MapperFactory.mapStringBoolean,
    msg: 'Enter comma separated booleans'
  }
};

class PrimitiveArrayManager {
  constructor(key, templateArray, type) {
    this.templateArray = templateArray;
    this.key = key;
    this.type = type;
  }

  convertArray(input) {
    const array = Array.isArray(input) ? input : input.split(',');
    return array.map(it => it.toString().trim());
  }

  validate(valueArray) {
    if(!VALIDATORS.hasOwnProperty(this.type)) {
      return true;
    }

    const validator = VALIDATORS[this.type];
    if(!ValidatorFactory.validateAll(valueArray, validator.fn)) {
      return validator.msg;
    }

    return true;
  }

  async getValue() {
    const defaultValue = this.templateArray;
    const {value} = await inquirer.prompt({
      name: 'value',
      message: `Enter comma separated values for ${this.key}:`,
      default: defaultValue,
      filter: v => this.convertArray(v),
      validate: v => this.validate(v)
    });

    const validator = VALIDATORS[this.type];
    return validator ? value.map(validator.mapper) : value;
  }
}

module.exports = PrimitiveArrayManager;
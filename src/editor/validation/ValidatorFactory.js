const _ = require('lodash');

const NUMBER_INPUT_VALIDATOR_MSG = 'Enter number';

class ValidatorFactory {

  /**
   * @param {Array} array
   * @param {Function} validate
   */
  static validateAll(array, validate) {
    const unfit = array.find(it => !validate(it));
    return unfit === undefined;
  }

  static validateNumber(value) {
    try {
      let number = parseInt(value, 10);
      if (!Number.isNaN(number)) {
        return true;
      }
      number = parseFloat(value);
      return !Number.isNaN(number);
    } catch (e) {
      return false;
    }
  }

  static validateStringBoolean(value) {
    return ['true', 'false'].includes(value);
  }

  static choosePrimitiveValidator(templateValue) {
    if (_.isNumber(templateValue)) {
      return v =>
        ValidatorFactory.validateNumber(v) || NUMBER_INPUT_VALIDATOR_MSG;
    }

    return () => true;
  }
}

module.exports = ValidatorFactory;
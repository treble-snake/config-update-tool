const _ = require('lodash');

class MapperFactory {
  static mapPrimitive(templateValue, currentValue) {
    if(_.isNumber(templateValue)) {
      return MapperFactory.mapToNumber(currentValue);
    }

    if(_.isBoolean(templateValue)) {
      return MapperFactory.mapToBoolean(currentValue);
    }

    return currentValue;
  }

  static mapToNumber(value) {
    return parseFloat(value);
  }

  static mapToBoolean(value) {
    return Boolean(value);
  }

  static mapIdentity(value) {
    return value;
  }

  static mapStringBoolean(value) {
    return value === 'true';
  }
}

module.exports = MapperFactory;
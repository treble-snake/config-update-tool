const _ = require('lodash');
const Types = require('./Types');

class ArrayFactory {
  static async getValue(key, templateArray) {
    const typesFound = new Set();

    for(const item of templateArray) {
      if(_.isBoolean(item)) {
        typesFound.add(Types.booleans);
      }
      else if(_.isNumber(item)) {
        typesFound.add(Types.numbers);
      }
      else if(_.isString(item)) {
        typesFound.add(Types.strings);
      }
      else if(_.isObject(item)) {
        typesFound.add(Types.objects);
      } else {
        typesFound.add(Types.others);
      }

      if(typesFound.size > 1) {
        throw new Error('Can\'t handle mixed arrays yet');
      }
    }

    if(typesFound.has(Types.others)) {
      throw new Error('Unknown items type');
    }

    if(typesFound.has(Types.objects)) {
      return (new (require('./ObjectArrayManager'))(key, templateArray)).getValue();
    }

    const [theType] = [...typesFound];
    return (new (require('./PrimitiveArrayManager'))(key, templateArray, theType)).getValue();
  }
}

module.exports = ArrayFactory;
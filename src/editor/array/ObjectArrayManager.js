const inquirer = require('inquirer');
const editArrayPlugin = require('./ArrayInquirerPlugin');
const ObjectManager = require('../ObjectManager');

const ACTIONS = editArrayPlugin.ACTIONS;

inquirer.registerPrompt('editArray', editArrayPlugin);


class ObjectArrayManager {
  constructor(key, templateArray) {
    this.templateArray = templateArray;
    this.key = key;
    this.templateItem = this.templateArray[0];
  }

  async _fillObject(template) {
    const manger = new ObjectManager();
    return manger.fillObject(template || this.templateItem, this.key);
  }

  async _createItem(index, currentArray) {
    const item = await this._fillObject();
    const newArray = currentArray.slice();
    newArray.splice(index + 1, 0, item);
    return this._getValue(newArray, index + 1);
  }

  async _editItem(index, currentArray) {
    const item = await this._fillObject(currentArray[index]);
    const newArray = currentArray.slice();
    newArray[index] = item;
    return this._getValue(newArray, index);
  }

  async _getValue(currentArray, defIndex = 0) {
    const {result} = await inquirer.prompt({
      type: 'editArray',
      name: 'result',
      message: `Edit the array for ${this.key}`,
      choices: currentArray,
      default: defIndex
    });

    if(result.action.key === ACTIONS.create.key) {
      return this._createItem(result.index, result.items);
    }

    if(result.action.key === ACTIONS.edit.key) {
      return this._editItem(result.index, result.items);
    }

    return result.items;
  }

  async getValue() {
    return this._getValue(this.templateArray);
  }
}

module.exports = ObjectArrayManager;
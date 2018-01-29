const _ = require('lodash');
const chalk = require('chalk');
const figures = require('figures');
const cliCursor = require('cli-cursor');
const Base = require('inquirer/lib/prompts/base');
const observe = require('inquirer/lib/utils/events');
const Paginator = require('inquirer/lib/utils/paginator');
const Choices = require('inquirer/lib/objects/choices');

const ACTIONS_MAP = {
  quit: {
    key: 'q',
    name: 'Finish editing'
  },
  create: {
    key: 'a',
    name: 'Add item'
  },
  edit: {
    key: 'e',
    name: 'Edit item'
  },
  delete: {
    key: 'd',
    name: 'Delete item'
  }
};

const HINT = Object.values(ACTIONS_MAP)
  .map(it => `${it.key} - ${it.name.toLowerCase()}`)
  .join(', ');

const AVAILABLE_KEYS = Object.values(ACTIONS_MAP).map(it => it.key);

class EditArrayPrompt extends Base {
  constructor(questions, rl, answers) {
    super(questions, rl, answers);
    if (!this.opt.choices) {
      this.throwParamError('choices');
    }

    this.originalKeys = Object.keys(questions.choices[0]);

    this.selected = 0;
    const def = this.opt.default;
    if (_.isNumber(def) && def >= 0 && def < this.opt.choices.realLength) {
      this.selected = def;
    }

    // Make sure no default is set (so it won't be printed)
    this.selectedAction = null;
    this.opt.default = null;
    this.firstRender = true;
    this.paginator = new Paginator(this.screen);

    // small hack for inquirer events
    this.markComplete = null;
    this.completePromise = new Promise((resolve => {
      this.markComplete = resolve;
    }));
  }

  _deleteSelectedItem() {
    this.opt.choices =
      new Choices(this.opt.choices.filter((v, i) => i !== this.selected));

    if (this.selected === this.opt.choices.realLength) {
      this.selected -= 1;
    }

    return this.render();
  }

  _onKey(key) {
    if (key === ACTIONS_MAP.delete.key) {
      return this._deleteSelectedItem();
    }

    this.onSubmit(Object.values(ACTIONS_MAP).find(it => it.key === key));
  }

  /**
   * Start the Inquiry session
   * @param  {Function} cb      Callback when prompt is done
   * @return {EditArrayPrompt}
   */
  _run(cb) {
    this.done = cb;

    const events = observe(this.rl);

    const completeEvent = this.completePromise; // originally events.line

    events.normalizedUpKey.takeUntil(completeEvent).forEach(this.onUpKey.bind(this));
    events.normalizedDownKey.takeUntil(completeEvent).forEach(this.onDownKey.bind(this));
    events.numberKey.takeUntil(completeEvent).forEach(this.onNumberKey.bind(this));

    events.keypress.filter(({key: {name}}) => AVAILABLE_KEYS.includes(name))
      .share()
      .takeUntil(completeEvent)
      .forEach(({key}) => {
        this._onKey(key.name);
      });

    events.line
      .take(1)
      .forEach(this.onSubmit.bind(this, ACTIONS_MAP.edit));

    // Init the prompt
    cliCursor.hide();
    this.render();

    return this;
  }

  /**
   * Render the prompt to screen
   * @return {EditArrayPrompt} self
   */
  render() {
    // Render question
    let message = this.getQuestion();

    if (this.firstRender) {
      message += chalk.yellow('(Use arrow keys and Enter to finish)');
    }

    // Render choices or answer depending on the state
    if (this.status === 'answered') {
      message += chalk.cyan(this.selectedAction.name);
    } else {
      message += chalk.yellow(`\n// ${HINT}`);

      const choicesStr = this._renderList();
      const indexPosition = this.opt.choices.indexOf(
        this.opt.choices.getChoice(this.selected)
      );
      message +=
        '\n' + this.paginator.paginate(choicesStr, indexPosition, this.opt.pageSize);
    }

    this.firstRender = false;

    this.screen.render(message);
    return this;
  }

  /**
   * When user press `enter` key
   */

  onSubmit(action) {
    this.markComplete();
    this.status = 'answered';
    this.selectedAction = action;

    // Rerender prompt
    this.render();

    this.screen.done();
    cliCursor.show();

    const items =
      this.opt.choices.realChoices.map(it => _.pick(it, this.originalKeys));
    this.done({action, index: this.selected, items});
  }

  /**
   * When user press a key
   */
  onUpKey() {
    const len = this.opt.choices.realLength;
    this.selected = this.selected > 0 ? this.selected - 1 : len - 1;
    this.render();
  }

  onDownKey() {
    const len = this.opt.choices.realLength;
    this.selected = this.selected < len - 1 ? this.selected + 1 : 0;
    this.render();
  }

  onNumberKey(input) {
    if (input <= this.opt.choices.realLength) {
      this.selected = input - 1;
    }
    this.render();
  }

  _stringifyItem(item) {
    const json = JSON.stringify(_.pick(item, this.originalKeys))
      .replace(/[{}]/g, '')
      .replace(/^"/, '')
      .replace(/([^\\])(")/g, '$1')
      .replace(/\\"/g, '"')
      .replace(/:/g, ': ')
      .replace(/,/g, ',  ');

    return `${json}`;
  }

  /**
   * Function for rendering list choices
   * @return {String}         Rendered content
   */
  _renderList() {
    let output = '';

    this.opt.choices.forEach((choice, i) => {
      const isSelected = i === this.selected;
      let line = (isSelected ? figures.pointer + ' ' : '  ') +
        this._stringifyItem(choice);
      if (isSelected) {
        line = chalk.cyan(line);
      }
      output += line + ' \n';
    });

    return output.replace(/\n$/, '');
  }
}

module.exports = EditArrayPrompt;
module.exports.ACTIONS = ACTIONS_MAP;
#! /usr/bin/env node
const ConfigTool = require('../src/ConfigTool');

ConfigTool.run()
  .catch(e => console.error(e));

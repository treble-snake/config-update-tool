const ConfigTool = require('../src/ConfigTool');

const tool = new ConfigTool();

tool.run()
  .catch(e => console.error(e));

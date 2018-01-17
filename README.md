# Config Update Tool

Are you familiar with a situation when you have a configuration file template under VCS and you have to manually update its instance on a remote host each time you deploy any changes to the template (mostly add new config properties)?

Pretty annoying, isn't it?

So this command line tool could help you update your config files fast and handy. I hope.

## Installation and usage 
Prerequisites: Node.js (>=7.10).

Sorry, but this is it for now. I'm planning to add v6 compatibility.

### Using as stand-alone tool
Clone the repo: https://github.com/treble-snake/config-update-tool

Then use `npm run help` or `node bin/index.js --help` to output the manual.
You should see the following: 
```
Usage: npm start -- [--mode <mode>] [--input <path>] [--output <path>] [--backup]

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  -m, --mode    Usage mode: `create` for new config file and `merge` for
                modifying existing one                           [default: null]
  -o, --output  Path to the output file                 [string] [default: null]
  -b, --backup  Make a backup of the output file       [boolean] [default: null]
  -i, --input   Path to the input file                  [string] [default: null]
  --no-b        Don't make a backup of the output file
```

#### Mode
There are two usage modes for now: **create** and **merge**.

In the **create** mode the tool takes config template form the given input file and asks for config property values in interactive mode, then writes the data to the output file.

In the **merge** mode (my favorite one) the tool takes template's _and_ existing config's data, then asks for missing properties only, removes redundant properties and overwrites output file (optionally it can create a backup file).

### Using as a dependency

You can install the tool as a dependency to your project (probably a dev-dependency):
```
npm install config-update-tool --save-dev

```

And then just run it from your code like that:
```
const ConfigTool = require('config-update-tool');

ConfigTool.run()
  .catch(e => console.error(e));
```
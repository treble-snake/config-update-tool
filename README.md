# Config Update Tool

Are you familiar with the situation when you have a configuration file template under VCS and you have to manually update its instance on a remote host each time you deploy any changes to the template (mostly add new config properties)?

Pretty annoying, isn't it?

So this command line tool could help you update your config files fast and handy. I hope.

_Please, consider that it's just an MVP yet. I'm working on improvements (see [GitHub Issues](https://github.com/treble-snake/config-update-tool/issues) if interested)._

## Installation and usage 
Prerequisites: Node.js (>=8).

Sorry, but this is it for now. I'm planning to add v6 compatibility.

### Available formats
The tool can:
 - read **.js** and **.json** files; 
 - write **.js** and **.json** files.

I'm going to add **.yml** and **.xml** support.

### Using as a stand-alone tool
Install the tool globally (or locally without `-g` flag) by running
```
npm install -g config-update-tool
```

Then use `cupd --help` (it's like **c**onfig **upd**ate, aye?) or full `config-update-tool --help` to output the manual.

_You can also clone [the repo](https://github.com/treble-snake/config-update-tool) and then use `npm run help` to do the same._

You should see the following: 
```
Usage: config-update-tool [--mode <mode>] [--input <path>] [--output <path>] 
[--backup] [--force]

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  -m, --mode    Usage mode: `create` for new config file and `merge` for
                modifying existing one                           [default: null]
  -i, --input   Path to the input file                  [string] [default: null]
  -o, --output  Path to the output file                 [string] [default: null]
  -b, --backup  Make a backup of the output file       [boolean] [default: null]
  --no-b        Don't make a backup of the output file
  -f, --force   Tool won't ask for user prompt and use template values
                                                       [boolean] [default: null]
  --no-f        Tool will ask for user prompt
```

All arguments are optional, you will be asked to enter missing ones in interactive mode anyway.

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

ConfigTool.run([options])
  .catch(e => console.error(e));
```
You can pass all or some of the following options as `options` object properties:
* **mode** - work mode (create or merge)
* **inputFile** - absolute or relative to cwd path to the input config template file
* **outputFile** - absolute or relative to cwd path to the config output file
* **backupRequired** - if true, tool will make attempt to create a backup copy of the output file
* **isForce** - if true, tool will take template values and won't ask for user prompt

These options will **NOT** be overwritten by command line arguments.
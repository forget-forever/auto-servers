#!/usr/bin/env node
import { program } from "commander";
import init from "./models/init";

program.version(require("../package.json").version, '-v --version').usage('<command> [name] <option>');

program.command('init [name]').description('init loading....').action((name) => {
  init(name)
})

program.command('create [name] [option]').description('creating a project')
.option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
.option('-d, --default', 'Skip prompts and use default preset')
.option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
.option('-g, --git [message]', 'Force git initialization with initial commit message')
.action((name, option) => {
  console.log(name)
  console.log(option)
  
})

program.parse(process.argv);
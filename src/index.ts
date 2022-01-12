#!/usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import create from "./models/create";
import init from "./models/init";
import { info } from "./utils";
import { setParams } from "./utils/params";

program.version(require("../package.json").version, '-v --version').usage('<command> <command> [name]');

program.command('init [name]').description('init loading....').action((name) => {
  init(name)
})

program.command('create').option('-c [configFile]').option('-t [type]').option('-d [debug]').action((option = {}) => {
  if (option.c) {
    info(`配置文件：${chalk.green(option.c)}`)
  }
  if (option.t) {
    info(`获取 ${chalk.green(option.t)} 类型/集合的接口`)
  }
  setParams({type: option.t, configFile: option.c, debug: option.d})
  create()
})

program.parse(process.argv);
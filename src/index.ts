#!/usr/bin/env node
require('module-alias/register')
require('tsconfig-paths/register')
import chalk from "chalk";
import { program } from "commander";
import { resolve } from "path";
import create from "./models/create";
import init from "./models/init";
import { info } from "./utils";
import { getParams, setParams } from "./utils/params";

program.version(require("../package.json").version, '-v --version').usage('<command> <command> [name]');

program.command('init [name]').description('init loading....').action((name) => {
  init(name)
})

program.command('create').option('-c [configFile]').option('-t [type]').option('-d [debug]').action((option = {}) => {
  setParams({type: option.t, configFile: option.c, debug: option.d})
  const params = getParams()
  info(`配置文件： ${chalk.green(resolve(process.cwd(), params.configFile))}`)
  info(`获取 ${chalk.green(params.type || '全部')} 类型/集合的接口`)
  info(``)
  create()
})

program.parse(process.argv);
#!/usr/bin/env node
import { program } from "commander";
import typeofJsonc from "typeof-jsonc";

program.version(require("../package.json").version, '-v --version').usage('<command> [name] <option>');

console.log(typeofJsonc(`{// 测试
  a: ''}`, 'test', {export: true, singleLineJsDocComments: true}))

program.parse(process.argv);
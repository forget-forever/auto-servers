/*
 * @Author: zml
 * @Date: 2022-01-10 15:23:41
 * @LastEditTime: 2022-03-17 16:19:22
 */
require('module-alias/register')
require('tsconfig-paths/register')
import { readdirSync } from "fs";
import path from "path";
import inquirer from 'inquirer'

const files = readdirSync(path.join(__dirname, './test'))

const init = async () => {
  const ans = await inquirer.prompt({
    type: 'list',
    message: '请选择单元测试文件',
    name: 'res',
    choices: files
  })
  const test = require(`./test/${ans.res}`)
  console.log(test())
}

init()
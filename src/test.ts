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
  test()
}

init()
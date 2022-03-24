/*
 * @Author: zml
 * @Date: 2022-01-10 20:32:04
 * @LastEditTime: 2022-02-21 17:59:15
 */
import config from "@as-src/config";
import chalk from "chalk";
import { copyFileSync } from "fs";
import { resolve } from "path";

import { info } from "@as-src/utils";
import inquirer from "inquirer";

const init = async (name = '') => {
  const langMap = {
    'TypeScript': 'ts',
    'JavaScript': 'js'
  }
  const fileName = `${name}.asconfig.js`
  const ans = await inquirer.prompt({
    type: 'list',
    message: '请选择项目语言:',
    name: 'res',
    choices: Object.keys(langMap)
  })
  copyFileSync(resolve(config.rootDir, `tpl/copy-${langMap[ans.res]}.asconfig.js`), resolve(process.cwd(), fileName))
  info(chalk.bold.green(`>> 创建${fileName}成功🙆 `))
};

export default init;
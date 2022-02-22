/*
 * @Author: zml
 * @Date: 2022-01-10 20:32:04
 * @LastEditTime: 2022-02-21 17:59:15
 */
import config from "@/config";
import chalk from "chalk";
import { copyFileSync } from "fs";
import { resolve } from "path";

import { info } from "@/utils";

const init = (name = '') => {
  const fileName = `${name}.asconfig.js`
  copyFileSync(resolve(config.rootDir, 'tpl/copy.asconfig.js'), resolve(process.cwd(), fileName))
  info(chalk.bold.green(`>> 创建${fileName}成功🙆 `))
};

export default init;
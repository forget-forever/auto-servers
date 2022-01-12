import chalk from "chalk";
import { copyFileSync } from "fs";
import { resolve } from "path";
import { info } from "../../utils";

const init = (name = '') => {
  const fileName = `${name}.asconfig.js`
  copyFileSync(resolve(__dirname, '../../tpl/asconfig.js'), resolve(process.cwd(), fileName))
  info(chalk.bold.green(`>> 创建${fileName}成功🙆 `))
};

export default init;
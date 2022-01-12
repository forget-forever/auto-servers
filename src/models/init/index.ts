import chalk from "chalk";
import { copyFileSync } from "fs";
import { resolve } from "path";
import { info } from "../../utils";

const init = (name = 'as') => {
  copyFileSync(resolve(__dirname, '../../tpl/as.config.json'), resolve(process.cwd(), `${name}.config.json`))
  info(chalk.bold.green(`>> 创建${name}.config.json成功🙆 `))
};

export default init;
/*
 * @Author: zml
 * @Date: 2022-01-10 20:32:24
 * @LastEditTime: 2022-02-17 12:41:17
 */
import { OneListItem } from "./listType"
import inquirer from "inquirer"
import { info, ProgressLogs } from "@/utils"
import chalk from "chalk"
import run from "./run"
import { emoji } from "node-emoji"
import { getApis, listHandle } from "./catchApi"
import { fileAfterHandle, filePreHandle } from "./fileHandle"

/**
 * 开始生成任务队列
 * @param apis 任务的数组
 */
const createTasks = async (apis: OneListItem[]) => {
  filePreHandle()
  const progressLog = new ProgressLogs({
    title: 'ok！现在开始生成方法',
    record: true,
    loadingEffect: apis.length
  })
  apis.forEach((item) => {
    progressLog.add('生成方法:', item.path, {color: 'green'})
  })
  progressLog.start()
  for(let i = 0; i < apis.length; i++) {
    await run(apis[i])
    progressLog.next('success')
  }
  fileAfterHandle()
}

/**
 * 主流程，开始创建serve
 */
const create = async () => {
  const apiList = await getApis()
  const fetchList = await listHandle(apiList)
  if (!fetchList.length) {
    info(chalk.bold.yellow('>> 没有相关的接口，程序终止！'))
    process.exit()
  }
  info(fetchList.map((item) => item.path))
  const answer = await inquirer.prompt({
    type: 'confirm',
    message: `>> ${chalk.bold.yellow(emoji.warning)}是否生成以上 ${chalk.bold.red(`${fetchList.length}个`)} serve方法👆`,
    name: 'continue',
  })
  if (answer.continue) {
    createTasks(fetchList)
  } else {
    info(chalk.bold.red('>> 🤔取消获取servers方法，程序终止运行！'))
    process.exit()
  }
}

export default create
import { getParams } from "../../utils/params"
import { getYpiMsg } from "../../servers"
import { ApiListItem, OneListItem } from "./type"
import config from "../../config"
import { getConfig } from "../../utils/config"
import inquirer from "inquirer"
import { info } from "../../utils"
import chalk from "chalk"
import catchApi from "./catchApi"
import ProgressLogs from "../../utils/ProgressLogs"
import { emoji } from "node-emoji"

/** 从yapi远程获取接口列表 */
const getApis = async () => {
  const res = await getYpiMsg<ApiListItem[]>('/api/interface/list_menu')
  return res.data
}

/**
 * 整合接口列表这次要获取那些接口的数据
 * @param apiList 接口的列表
 * @returns 接口分类打平之后的数据
 */
const listHandle = (apiList: ApiListItem[]) => {
  const shallowList = apiList.reduce((pre, cur) => pre.concat(cur.list), [] as OneListItem[]);
  const params = getParams()
  if (!params.type) {
    // 没有-t的参数，直接获取全部接口
    return shallowList;
  } else if ((Object.keys(getConfig('collections')) as string[]).includes(params.type)) {
    // 获取配置文件中的集合的接口
    const collections = getConfig('collections')[params.type] as string[]
    return shallowList.filter((item) => collections.every((e) => item.tag.includes(e)))
  } else {
    // 匹配上了url，获取一个接口
    const urlRes = shallowList.filter((item) => item.path.trim() === params.type.trim())
    if (urlRes.length) {
      return urlRes
    }
    // 获取制定分类的接口
    const { similarSubstring } = require('similar-substring');
    return apiList.reduce((pre, cur) => {
      if (+similarSubstring(cur.name || '', params.type || '').similarity > +config.similarThreshold) {
        return pre.concat(cur.list)
      }
      return pre
    },  [] as OneListItem[])
  }
}

/**
 * 开始生成任务队列
 * @param apis 任务的数组
 */
const createTasks = async (apis: OneListItem[]) => {
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
    await catchApi(apis[i])
    progressLog.next('success')
  }
}

/**
 * 主流程，开始创建serve
 */
const create = async () => {
  const apiList = await getApis()
  const fetchList = listHandle(apiList)
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
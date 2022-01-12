import { getParams } from "../../utils/params"
import { getYpiMsg } from "../../servers"
import { ApiListItem, OneListItem } from "./type"
import config from "../../config"
import { getConfig } from "../../utils/config"
import inquirer from "inquirer"
import { info, infoSplitLine } from "../../utils"
import chalk from "chalk"
import catchApi from "./catchApi"

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

const create = async () => {
  const apiList = await getApis()
  const fetchList = listHandle(apiList)
  if (!fetchList.length) {
    info(chalk.bold.yellow('>> 没有想关的接口，程序终止！'))
    process.exit()
  }
  info(`>> ⚠️获取以下 ${chalk.bold.red(`${fetchList.length}个`)} 接口的数据 👇`)
  info(fetchList.map((item) => item.path))
  try {
    const answer = await inquirer.prompt({
      type: 'confirm',
      message: '是否开始获取',
      name: 'continue',
    })
    if (answer.continue) {
      info('✅确定获取，开始抓取接口，请耐心等待。。。。。')
      infoSplitLine()
      fetchList.forEach(async (item) => {
        await catchApi(item)
      })
    } else {
      info(chalk.bold.green('>> 🤔取消获取servers，程序终止运行！'))
      process.exit()
    }
  } catch (error) {
    info(chalk.bold.red('>> 程序意外终止'))
    info(error)
    process.exit()
  }
}

export default create
import { getNetMsg } from "@/utils/request"
import config from "@/config"
import type { TranslateRes } from "./type"
import { CoreOptions } from "request"
import { getConfig } from "@/utils/config"
import { info } from "@/utils"
import chalk from "chalk"
import { emoji } from "node-emoji"
import pinyin from "pinyin"


export const translate = async (query: string[], params?: Record<string, string>) => {
  let enArr = [] as string[]
  try {
    const { res } = await getNetMsg<TranslateRes>({
      url: config.translateUrl,
      method: 'POST',
      formData: {
        q: query.join(" -& "),
        from: 'zh-CHS',
        to: 'en',
        ...params
      }
    })
    enArr = (res.translation[0] && res.translation[0].trim().split("-&")) || query
  } catch (error) {
    info(chalk.bold.red(`${emoji.watch}有道翻译api异常, 开始使用拼音，请及时检修`))
    enArr = query.map((item) => pinyin(item).join())
  }
  return query.reduce((pre, cur, index) => ({...pre, [cur]: enArr[index] || cur}), {} as Record<string, string>)
}

type IResModel<D> = { errcode: number, errmsg: string, data: D}

export const getYpiMsg = async <RES>(url: `/${string}`, option: CoreOptions = {}) => {
  info(`获取yapi：${url}的数据`, 'debug')
  const {formData, ...resetOptions} = option
  const {res} = await getNetMsg<IResModel<RES>>({
    url: `${getConfig('mockUrl')}${url}`,
    method: 'GET',
    formData: {
      token: getConfig('token'),
      project_id: getConfig('projectId'),
      ...formData
    },
    ...resetOptions
  })
  if (+res.errcode === 0) {
    return res
  } else {
    return Promise.reject(res)
  }
}
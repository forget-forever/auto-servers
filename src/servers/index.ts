import { getNetMsg } from "../utils/request"
import config from "../config"
import type { TranslateRes } from "./type"
import { CoreOptions } from "request"
import { getConfig } from "../utils"


export const translate = async (query: string[]) => {
  const { res } = await getNetMsg<TranslateRes>({
    url: config.translateUrl,
    method: 'POST',
    formData: {
      q: query.join(" -& "),
      from: 'Auto',
      to: 'Auto'
    }
  })
  const enArr = res.translation[0] && res.translation[0].trim().split("-&")
  return query.reduce((pre, cur, index) => ({...pre, [cur]: enArr[index] || cur}), {} as Record<string, string>)
}

export const getYpiMsg = async <RES>(url: string, option: CoreOptions) => {
  const {res} = await getNetMsg<RES>({
    url,
    method: 'POST',
    formData: {
      token: getConfig('token'),
      ...option.formData
    },
    ...option
  })
  return res
}
import { getNetMsg } from "../utils/request"
import config from "../config"
import type { TranslateRes } from "./type"

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
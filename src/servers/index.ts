import { getNetMsg } from "../utils/request"
import config from "../config"
import type { TranslateRes } from "./type"

export const translate = async (query: string[]) => {
  const { res } = await getNetMsg<TranslateRes>({
    url: config.translateUrl,
    method: 'POST',
    formData: {
      q: query,
      from: 'Auto',
      to: 'Auto'
    }
  })
  return query.reduce((pre, cur, index) => ({...pre, [cur]: res.translation[index]}), {} as Record<string, string>)
}
// import typeofJsonc from "typeof-jsonc";
import { getParams } from "../../utils/params"
import { getYpiMsg } from "../../servers"
import { ApiListItem, OneListItem } from "./type"
import config from "../../config"
import { getConfig } from "../../utils/config"

/** 从yapi远程获取接口列表 */
const getApis = async () => {
  const res = await getYpiMsg<ApiListItem[]>('/api/interface/list_menu')
  return res.data
}

/**
 * 整合接口列表这次要获取那些接口的数据
 * @param apiList 接口的列表
 * @returns 接口打平之后的数据
 */
const listHandle = (apiList: ApiListItem[]) => {
  const shallowList = apiList.reduce((pre, cur) => pre.concat(cur.list), [] as OneListItem[]);
  const params = getParams()
  if (!params.type) {
    return shallowList;
  } else if ((Object.keys(getConfig('collections')) as string[]).includes(params.type)) {
    const collections = getConfig('collections')[params.type] as string[]
    return shallowList.filter((item) => collections.every((e) => item.tag.includes(e)))
  } else {
    const urlRes = shallowList.filter((item) => item.path.trim() === params.type.trim())
    if (urlRes.length) {
      return urlRes
    }
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
  console.log(fetchList.map((item) => item.path))
}

export default create
/*
 * @Author: zml
 * @Date: 2022-02-08 14:53:05
 * @LastEditTime: 2022-02-08 14:53:06
 */
import config from "@/config"
import { getYpiMsg, translate } from "@/servers"
import { objMap } from "@/utils"
import { getConfig } from "@/utils/config"
import { getParams } from "@/utils/params"
import { camelCase } from "lodash"
import { ApiListItem, OneListItem } from "./listType"

/** 从yapi远程获取接口列表 */
export const getApis = async () => {
  const res = await getYpiMsg<ApiListItem[]>(config.interfaceListUrl)
  return res.data
}

/**
 * 将带了分类的两层的目录整合成一层的
 * @param apiList 
 * @returns 打平之后的数组
 */
const typeApiPreHandle = async (apiList: ApiListItem[]) => {
  // 获取翻译
  const typeEn = await translate(apiList.map((item) => item.name.replace(/分类|分组/g, '') || getConfig('defaultApisType')))
  // 将翻译驼峰化，之后要做目录名
  const pathEn = objMap(typeEn, (k, v) => ({[k]: camelCase(v)}))
  // 打平数组
  const shallowList = apiList.reduce((pre, cur) => 
    pre.concat(cur.list.map((item) => ({
      ...item,
      type: cur.name,
      typeDesc: cur.desc || '',
      pathType: pathEn[cur.name]
    }))),[] as OneListItem[]
  );
  return shallowList;
}

/**
 * 整合接口列表这次要获取那些接口的数据
 * @param apiList 接口的列表
 * @returns 接口分类打平之后的数据
 */
export const listHandle = async (apiList: ApiListItem[]) => {
  const shallowList = await typeApiPreHandle(apiList)
  const params = getParams()
  if (!params.type) {
    // 没有-t的参数，直接获取全部接口
    return shallowList;
  } else if (getConfig('collections')[params.type]) {
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
    return shallowList.filter((item) => 
      (+similarSubstring(item.type || '', params.type || '').similarity > +config.similarThreshold)
    )
  }
}
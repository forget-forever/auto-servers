/*
 * @Author: zml
 * @Date: 2022-01-12 18:16:04
 * @LastEditTime: 2022-02-08 11:20:57
 */
import { ApiDetail } from "./detailType";
import { OneListItem } from "./listType";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { getConfig } from "@/utils/config";
import config from "@/config";
import { getYpiMsg } from "@/servers";

const apiDetailHandle = (data: ApiDetail<'str'>) => {
  const res = {...data}
  if (typeof data.res_body === 'string') {
    res.res_body = JSON.parse(data.res_body)
  }
  if (typeof data.req_body_other === 'string') {
    res.req_body_other = JSON.parse(data.req_body_other)
  }
  return res as unknown as ApiDetail<'obj'>
}

const getPath = (api: OneListItem) => {
  const extendName = getConfig('extendName')
  mkdirSync(resolve(config.rootDir, `tmp/${api.pathType}`), {recursive: true})
  const file = existsSync(resolve(config.rootDir, `tmp/${api.pathType}/index${extendName}`))
  console.log(file)
}

const catchApi = async (api: OneListItem) => {
  const res = await getYpiMsg<ApiDetail<'str'>>(config.interfaceDetailUrl, {
    formData: { id: api._id}
  })
  const apiDetail = apiDetailHandle(res.data)
  // console.log(apiDetail.req_body_other)
  // try {
  //   const typeRes = await compileType(apiDetail.res_body, '')
  //   console.log(typeRes)
  // } catch (error) {
  //   console.log(error)
  //   return 'netWorkError' as const
  // }
  const serversTemplate = getConfig('serveiceTemplate')
  console.log(serversTemplate(apiDetail.path, 'P', 'D', 'R', apiDetail.method, apiDetail))
  getPath(api)
  return 'success' as const
}

export default catchApi
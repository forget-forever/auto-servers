/*
 * @Author: zml
 * @Date: 2022-01-12 18:16:04
 * @LastEditTime: 2022-02-07 19:02:02
 */
import { getConfig } from "../../utils/config";
import { getYpiMsg } from "../../servers";
import { ApiDetail } from "./detailType";
import { OneListItem } from "./listType";
import { compileType } from "../../utils";
import config from "../../config";
import { readFileSync } from "fs";
import { resolve } from "path";

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
  const file = readFileSync(resolve(__dirname, `../../tmp/${api.pathType}/index${extendName}`))
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
  return 'success' as const
  // console.log(res.data.title)
}

export default catchApi
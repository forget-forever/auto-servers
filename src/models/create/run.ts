/*
 * @Author: zml
 * @Date: 2022-01-12 18:16:04
 * @LastEditTime: 2022-02-08 15:24:22
 */
import { getConfig } from "@/utils/config";
import config from "@/config";
import { getYpiMsg } from "@/servers";
import { ApiDetail } from "./detailType";
import { OneListItem } from "./listType";
import { getPath } from "../utils";

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

const run = async (api: OneListItem) => {
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
  const {file} = getPath(api)
  return 'success' as const
}

export default run
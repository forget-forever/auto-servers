/*
 * @Author: zml
 * @Date: 2022-01-12 18:16:04
 * @LastEditTime: 2022-02-18 15:42:54
 */
import { getConfig } from "@/utils/config";
import config from "@/config";
import { getYpiMsg } from "@/servers";
import { ApiDetail } from "./detailType";
import { OneListItem } from "./listType";
import { createType, getDest, getFunctionName, pushFunction } from "../utils";

const apiDetailHandle = (data: ApiDetail<'str'>) => {
  const res = {...data}
  if (typeof data.res_body === 'string') {
    res.res_body = JSON.parse(data.res_body)
  }
  if (typeof data.req_body_other === 'string') {
    res.req_body_other = JSON.parse(data.req_body_other)
  }
  return res as ApiDetail<'obj'>
}

const run = async (api: OneListItem) => {
  const res = await getYpiMsg<ApiDetail<'str'>>(config.interfaceDetailUrl, {
    formData: { id: api._id }
  })
  const apiDetail = apiDetailHandle(res.data)

  const serversTemplate = getConfig('serviceTemplate')

  const {file, typeFile} = getDest(api)

  /** 目前使用这个方法，现在还是本地的，之后yapi更新接口，使用线上的接口获取类型 */
  const { dataTypeName, paramsTypeName, resTypeName } = await createType(apiDetail, typeFile)

  pushFunction(
    getFunctionName(api),
    serversTemplate(
      apiDetail.path,
      paramsTypeName,
      dataTypeName,
      resTypeName,
      apiDetail.method,
      apiDetail
    ),
    file, 
    api.title
  )

  return 'success' as const
}

export default run
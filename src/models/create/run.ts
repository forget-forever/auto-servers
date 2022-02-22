/*
 * @Author: zml
 * @Date: 2022-01-12 18:16:04
 * @LastEditTime: 2022-02-22 14:06:20
 */
import { getConfig } from "@/utils/config";
import config from "@/config";
import { getYpiMsg } from "@/servers";
import { ApiDetail } from "./detailType";
import { OneListItem } from "./listType";
import { createType, getDest, getFunctionName, urlPreHandle, pushFunction, paramsPreHandle, requestDataPreHandle } from "../utils";

const apiDetailHandle = (data: ApiDetail<'str'>) => {
  const res = {...data}
  if (data.res_body && typeof data.res_body === 'string') {
    res.res_body = JSON.parse(data.res_body)
  }
  if (data.req_body_other && typeof data.req_body_other === 'string') {
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

  /** 生成类型文件 */
  const { dataTypeName, paramsTypeName, resTypeName } = await createType(apiDetail, typeFile)

  /** 生成方法文件 */
  pushFunction(
    getFunctionName(api),
    serversTemplate({
      url: apiDetail.path,
      paramsType: paramsTypeName,
      dataType: dataTypeName,
      returnType: resTypeName,
      method: apiDetail.method,
      paramsHandle: paramsPreHandle,
      urlHandle: urlPreHandle,
      requestDataHandle: requestDataPreHandle,
      apiDetail
    }),
    file, 
    api.title
  )

  return 'success' as const
}

export default run
/*
 * @Author: zml
 * @Date: 2022-01-12 18:16:04
 * @LastEditTime: 2022-02-28 16:00:49
 */
import config from "@/config";
import { getYpiMsg } from "@/servers";
import { ApiDetail } from "../type/detailType";
import { OneListItem } from "../type/listType";
import { getDest, getFunctionName, pushFunction, createFunction } from "../utils";
import { createType } from "./typeHandle";

const apiDetailHandle = (data: ApiDetail<'str'>) => {
  const res = { ...data } as unknown as ApiDetail<'obj'>
  if (data.res_body && typeof data.res_body === 'string' && data.res_body_is_json_schema) {
    res.res_body_obj = JSON.parse(data.res_body)
  }
  if (data.req_body_other && typeof data.req_body_other === 'string' && data.req_body_is_json_schema) {
    res.req_body_obj = JSON.parse(data.req_body_other)
  }
  return res 
}

const run = async (api: OneListItem) => {
  const res = await getYpiMsg<ApiDetail<'str'>>(config.interfaceDetailUrl, {
    formData: { id: api._id }
  })
  const apiDetail = apiDetailHandle(res.data)

  const {file, typeFile, namespace} = getDest(api)

  /** 生成类型文件 */
  const { dataTypeName, paramsTypeName, resTypeName } = await createType(apiDetail, typeFile, namespace)

  /** 生成方法文件 */
  pushFunction(
    getFunctionName(api),
    createFunction({
      responseType: resTypeName,
      paramsType: paramsTypeName,
      dataType: dataTypeName,
      apiDetail
    }),
    file, 
    api.title
  )

  return 'success' as const
}

export default run
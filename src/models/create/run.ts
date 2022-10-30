/*
 * @Author: zml
 * @Date: 2022-01-12 18:16:04
 * @LastEditTime: 2022-02-28 16:00:49
 */
import config from "@as-src/config";
import { getYpiMsg } from "@as-src/servers";
import { ApiDetail } from "../type/detailType";
import { OneListItem } from "../type/listType";
import { getDest, getFunctionName, pushFunction, createFunction } from "../utils";
import { createType } from "./typeHandle";

const apiDetailHandle = (data: ApiDetail<'str'>) => {
  const res = { ...data } as unknown as ApiDetail<'obj'>
  const { res_body, res_body_is_json_schema, req_body_other, req_body_is_json_schema } = data
  if (res_body && typeof res_body === 'string' && res_body_is_json_schema) {
    res.res_body_obj = JSON.parse(res_body)
  }
  if (req_body_other && typeof req_body_other === 'string' && req_body_is_json_schema) {
    res.req_body_obj = JSON.parse(req_body_other)
  }
  return res 
}

const run = async (api: OneListItem) => {
  const {_id, title = ''} = api
  const res = await getYpiMsg<ApiDetail<'str'>>(config.interfaceDetailUrl, {
    formData: { id: _id }
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
    title
  )

  return 'success' as const
}

export default run
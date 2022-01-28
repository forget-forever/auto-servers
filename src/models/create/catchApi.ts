/*
 * @Author: zml
 * @Date: 2022-01-12 18:16:04
 * @LastEditTime: 2022-01-27 14:08:58
 */
import { getConfig } from "../../utils/config";
import { getYpiMsg } from "../../servers";
import { ApiDetail } from "./detailType";
import { OneListItem } from "./listType";
import { compileType } from "../../utils";

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

const catchApi = async (api: OneListItem) => {
  const res = await getYpiMsg<ApiDetail<'str'>>('/api/interface/get', {
    formData: { id: api._id}
  })
  const apiDetail = apiDetailHandle(res.data)
  // jsonToTs.compile()
  console.log(apiDetail.req_body_other)
  try {
    const typeRes = await compileType(apiDetail.res_body, '')
    console.log(typeRes)
  } catch (error) {
    console.log(error)
  }
  // console.log(apiDetail.res_body.type)
  // const createTemplate = getConfig('serveiceTemplate')
  // console.log(createTemplate('P', 'R', '{method: GET}', api.path))
  return 'success' as const
  // console.log(res.data.title)
}

export default catchApi
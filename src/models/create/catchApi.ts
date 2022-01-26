import { getYpiMsg } from "../../servers";
import { ApiDetail } from "./detailType";
import { OneListItem } from "./listType";
// import typeofJsonc from "typeof-jsonc";

const apiDetailHandle = (data: ApiDetail<'str'>): ApiDetail<'obj'> => {
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
  console.log(apiDetail.res_body.type)
  return 'success' as const
  // console.log(res.data.title)
}

export default catchApi
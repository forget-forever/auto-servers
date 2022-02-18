/*
 * @Author: zml
 * @Date: 2022-02-10 15:59:34
 * @LastEditTime: 2022-02-18 18:53:40
 */
import { upperFirst } from "lodash";
import { getFunctionName } from ".";
import { ApiDetail } from "../create/detailType";
import { createQuerySchema, getTypeStr } from "./getTypeStr";
import { pushType } from "./typeFileHandle";

/**
 * 生成类型
 * @param api api的详细数据
 * @returns 
 */
export const createType = async (api: ApiDetail<'obj'>, dest: string) => {
  const name = getFunctionName(api)

  let paramsTypeName = ''
  let dataTypeName = ''
  let resTypeName = ''
  const typeArr: string[] = []
  
  // 返回数据的类型
  if (api.res_body) {
    const type = await getTypeStr(api.res_body, 'root', 'data', upperFirst(`${name}Res`))
    if (type) {
      typeArr.push(type)
      resTypeName = upperFirst(`${name}Res`)
    }
  }
  
  // 请求体类型
  if (api.req_body_other) {
    const type = await getTypeStr(api.req_body_other, '', '', upperFirst(`${name}Data`))
    if (type) {
      typeArr.push(type)
      dataTypeName = upperFirst(`${name}Data`)
    }
  }

  // 请求的query类型
  if (api.req_query && api.req_query.length) {
    const type = await getTypeStr(createQuerySchema(api.req_query), '', '', upperFirst(`${name}Params`))
    if (type) {
      typeArr.push(type)
      paramsTypeName = upperFirst(`${name}Params`)
    }
  }

  const { namespace } = pushType(typeArr, dest)

  return {
    paramsTypeName: paramsTypeName ? `${namespace}.${paramsTypeName}` : '',
    dataTypeName: dataTypeName ? `${namespace}.${dataTypeName}` : '',
    resTypeName: resTypeName ? `${namespace}.${resTypeName}` : '',
  }
}

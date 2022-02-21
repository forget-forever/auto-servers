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
 * @param dest 目标文件，为空时会干会空的类型名
 * @returns 
 */
export const createType = async (api: ApiDetail<'obj'>, dest: string) => {
  // 目标路径为空，说明不要创建类型
  if (!dest) {
    return {paramsTypeName: '', dataTypeName: '', resTypeName: ''}
  }
  const name = getFunctionName(api)

  let paramsTypeName = ''
  let dataTypeName = ''
  let resTypeName = ''
  const typeArr: string[] = []
  
  // 返回数据的类型
  if (api.res_body) {
    const type = await getTypeStr(api.res_body, upperFirst(`${name}Res`), 'root', 'data')
    if (type) {
      typeArr.push(type)
      resTypeName = upperFirst(`${name}Res`)
    }
  }
  
  // 请求体类型
  if (api.req_body_other) {
    const type = await getTypeStr(api.req_body_other, upperFirst(`${name}Data`))
    if (type) {
      typeArr.push(type)
      dataTypeName = upperFirst(`${name}Data`)
    }
  }

  // 请求的query类型
  if (api.req_query && api.req_query.length) {
    const type = await getTypeStr(
      createQuerySchema((api.req_query || []).concat((api.req_params || []).map((item) => ({...item, example: 'String', required: '1'})))),
      upperFirst(`${name}Params`)
    )
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

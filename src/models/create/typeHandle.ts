/*
 * @Author: zml
 * @Date: 2022-03-03 20:08:52
 * @LastEditTime: 2022-03-03 20:17:58
 */

import { getConfig } from "@/utils/config"
import { ApiDetail } from "../type/detailType"
import { getFunctionName } from "../utils"
import { createQuerySchema, ParseType } from "../utils/getTypeStr"
import { getContent } from "../utils/typeFileHandle"

/**
 * 
 * @param typeArr 要写入的类型的数组
 * @param dest 目标文件
 * @param namespace 写入的命名空间
 * @returns 
 */
 export const pushType = (typeArr: string[], dest: string, namespace: string) => {
  const { content, setContent, type } = getContent(dest, namespace)
  if (type === 'export') {
    const typeStr = typeArr.filter(Boolean).map((ele) => `${type} ${ele}`).join('\n\n')
    setContent(`${content}\n${typeStr}`)
  } else {
    setContent(`${content}\n${typeArr.filter(Boolean).join('\n')}`)
  }
  return { namespace, type }
}

/**
 * 生成类型
 * @param api api的详细数据
 * @param dest 目标文件，为空时会干会空的类型名
 * @returns 
 */
 export const createType = async (api: ApiDetail<'obj'>, dest: string, namespace: string) => {
  // 目标路径为空，说明不要创建类型
  if (!dest) {
    return {paramsTypeName: '', dataTypeName: '', resTypeName: ''}
  }
  const name = getFunctionName(api)
  const parseType = new ParseType(name, namespace)
  
  const resMsg = await parseType.format({
    mod: api.res_body_is_json_schema ? 'schema': 'jsonc',
    schema: api.res_body_obj,
    startNode: getConfig('typeRootNode'),
    key: 'Res',
    str: api.res_body
  })

  const dataMsg = await parseType.format({
    key: 'Data',
    schema: api.req_body_obj,
    mod: api.req_body_is_json_schema ? 'schema' : 'jsonc',
    str: api.req_body_other
  })

  const paramsMsg = await parseType.format({
    key: 'Params',
    schema: createQuerySchema((api.req_query || []).concat((api.req_params || []).map((item) => ({...item, example: 'String', required: '1'})))),
  })
  const typeArr = [resMsg.typeVal, dataMsg.typeVal, paramsMsg.typeVal]
  pushType(typeArr, dest, namespace)

  return {
    paramsTypeName: paramsMsg.name,
    dataTypeName: dataMsg.name,
    resTypeName: resMsg.name,
  }
}

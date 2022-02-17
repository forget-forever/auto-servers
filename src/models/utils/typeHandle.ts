/*
 * @Author: zml
 * @Date: 2022-02-10 15:59:34
 * @LastEditTime: 2022-02-17 20:08:09
 */
import { compileType } from "@/utils";
import { upperFirst } from "lodash";
import { getFunctionName } from ".";
import { ApiDetail, SchemaBody } from "../create/detailType";
import { pushType } from "./typeFileHandle";

/**
 * 得到类型字符串
 * @param schema 类型的schema对象
 * @param startRoot 开始节点
 * @param typeName 生成的类型名称
 * @returns 类型字符串，如果是undefin则生成失败
 */
const getType = async (schema: SchemaBody, startRoot: string, typeName: string) => {
  if(schema.type === 'object') {
    // 如果没有properties schhema异常
    if (!schema.properties) return undefined

    const keys = Object.keys(schema.properties || {})
    if(keys.includes(startRoot)) {
      return compileType(schema.properties[startRoot], typeName, {ignoreMinAndMaxItems: true,})
    }
    let res: string | undefined
    for(const k in keys) {
      res = await getType(schema.properties[k], startRoot, typeName)
      if (res) break;
    }
    return res
  }
  return undefined
}

/**
 * 得到类型字符串
 * @param schema 类型的schema对象
 * @param name 节点名称，如果要直接生成那就 节点名称 和 开始节点 同名
 * @param startRoot 开始节点
 * @param typeName 生成的类型名称
 */
export const getTypeStr = async (schema: SchemaBody, name: string, startRoot: string, typeName: string) => {
  let typeStr: string | undefined = ''
  if (name === startRoot) {
    typeStr = await compileType(schema, typeName, {ignoreMinAndMaxItems: true,})
  } else {
    typeStr = await getType(schema, startRoot, typeName)
  }
  if (typeStr) {
    return typeStr.replace(/^(.*)(export )/s, '').replace(/^\n*|\n*$/g, '')
  }
  return Promise.reject(Error('类型添加失败'))
}

/**
 * 生成类型
 * @param api api的详细数据
 */
export const createType = async (api: ApiDetail<'obj'>, dest: string) => {
  const name = getFunctionName(api)

  let paramsTypeName = upperFirst(`${name}Params`)
  let dataTypeName = upperFirst(`${name}Data`)
  let resTypeName = upperFirst(`${name}Res`)

  const typeStr: string[] = []
  // let resTypeStr = ''
  // let dataTypeStr = ''
  if (api.res_body) {
    typeStr.push(await getTypeStr(api.res_body, 'root', 'data', resTypeName))
  } else {
    resTypeName = ''
  }
  
  if (api.req_body_other) {
    typeStr.push(await getTypeStr(api.req_body_other, '', '', dataTypeName))
  } else {
    dataTypeName = ''
  }

  if (api.req_query) {
    // typeStr.push(await getTypeStr(api.req_query, '', '', paramsTypeName))
    console.log(await compileType(api.req_query, paramsTypeName, {ignoreMinAndMaxItems: true,}))
  } else {
    paramsTypeName = ''
  }

  const { namespace } = pushType(typeStr.join('\n'), dest)

  return {
    paramsTypeName: paramsTypeName ? `${namespace}.${paramsTypeName}` : '',
    dataTypeName: dataTypeName ? `${namespace}.${dataTypeName}` : '',
    resTypeName: resTypeName ? `${namespace}.${resTypeName}` : '',
  }
}

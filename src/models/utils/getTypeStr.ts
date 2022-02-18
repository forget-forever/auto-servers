/*
 * @Author: zml
 * @Date: 2022-02-18 15:57:47
 * @LastEditTime: 2022-02-18 19:14:18
 */
import { compileType } from "@/utils"
import { Req_query, SchemaBody } from "../create/detailType"

/**
 * 校验是不是空类型
 * @param str 生成的类型字符串
 * @returns 如果是空的类型会返回undefined， 否则就原样返回
 */
const validateNullType = (str = '') => {
  const interfaceNullReg = /interface(\s)+(\w)*(\s)+(\{)(\n)*(\})/g
  const typeNullReg = /type(\s)+(\w)*(\s)*=(\s)*(\{)(\n)*(\})/g
  if (interfaceNullReg.test(str) || typeNullReg.test(str)){
    return undefined
  } else {
    return str.replace(/^\n*|\n*$/g, '')
  }
}

/**
 * 得到类型字符串
 * @param schema 类型的schema对象
 * @param startRoot 开始节点
 * @param typeName 生成的类型名称
 * @returns 类型字符串，如果是undefined则生成失败
 */
 const getType = async (schema: SchemaBody, startRoot: string, typeName: string) => {
  if(schema.type === 'object') {
    // 如果没有properties schhema异常
    if (!schema.properties) return undefined

    const keys = Object.keys(schema.properties || {})
    if(keys.includes(startRoot)) {
      return compileType({...schema.properties[startRoot], title: typeName}, typeName, {ignoreMinAndMaxItems: true,})
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
    typeStr = await compileType({...schema, title: typeName}, typeName, {ignoreMinAndMaxItems: true,})
  } else {
    typeStr = await getType(schema, startRoot, typeName)
  }
  if (typeStr) {
    return validateNullType(typeStr)
  }
  return undefined
}

/**
 * query数组生成typeSchema
 * @param queryArr query的数组
 * @returns 
 */
export const createQuerySchema = (queryArr: Req_query[]): SchemaBody => {
  const getType = (str: string) => {
    if (str === 'String') {
      return 'string' as const
    }
    return 'number' as const
  }
  return queryArr.reduce<SchemaBody>((pre, cur) => {
    pre.properties = {
      ...pre.properties,
      [cur.name]:  {type: getType(cur.example), required: !!cur.required, description: cur.desc}
    }
    return pre
  }, {type: 'object', properties: {}})
}

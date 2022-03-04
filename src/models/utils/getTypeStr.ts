/*
 * @Author: zml
 * @Date: 2022-02-18 15:57:47
 * @LastEditTime: 2022-03-04 15:51:59
 */
import { compileType, deleteNullStr, info } from "@/utils"
import jsonc2type from "jsonc2type"
import { upperFirst } from "lodash"
import { Req_query, SchemaBody } from "../type/detailType"

/**
 * 校验是不是空类型
 * @param str 生成的类型字符串
 * @returns 如果是空的类型会返回undefined， 否则就原样返回
 */
const validateNullType = (str = '') => {
  const interfaceNullReg = /interface(\s)+(\w)*(\s)+(\{)[\n\s]*(\})/g
  const typeNullReg = /type(\s)+(\w)*(\s)*=(\s)*(\{)[\n\s]*(\})/g
  if (interfaceNullReg.test(str) || typeNullReg.test(str)){
    return undefined
  } else {
    return deleteNullStr(str).replace(/(\s)+(\{)[\n\s]*(\})/g, ' Record<string, string>')
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
 * 得到类型字符串, 目前使用这个方法，现在还是本地的，之后yapi更新接口，使用线上的接口获取类型 date: 2022-2-21
 * @param schema 类型的schema对象
 * @param typeName 生成的类型名称
 * @param name 节点名称，如果要直接生成那就 节点名称 和 开始节点 同名
 * @param startRoot 开始节点
 */
export const getTypeStr = async (schema: SchemaBody, typeName: string, name = '', startRoot = '') => {
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


type GetTypeArgs = {
  /** 什么类型的类型字符串 */
  key: 'Params' | 'Res' | 'Data',
  /** 名称 */
  name?: string,
  /** 什么方式获取类型 */
  mod?: 'jsonc' | 'schema',
  /** 开始获取类型的节点，默认会与name相同 */
  startNode?: string,
  /** 类型的json-schema */
  schema?: SchemaBody,
  /** jsonc的字符串 */
  str?: string
}
export class ParseType {
  private name: string
  private namespace: string
  /**
   * 生成类型字符串
   * @param name 类型的名称
   * @param namespace 命名空间
   */
  constructor(name: string, namespace: string) {
    this.name = name;
    this.namespace = namespace
  }
  async format(args: GetTypeArgs) {
    const { schema, key, name = this.name, startNode = name, mod = 'schema', str } = args
    let res = { name: '', typeVal: '' }
    if (!schema && !str) {
      return res
    }
    const typeName = upperFirst(`${name}${key}`)
    if (mod === 'schema') {
      const type = await getTypeStr(schema || {}, typeName, name, startNode)
      if (type) {
        res = { name: `${this.namespace}.${typeName}`, typeVal: type }
      }else {
        res = { name: '', typeVal: ''}
      }
    } else {
      try {
        const type = jsonc2type(str || '{}', { startNode: startNode, name: typeName })
        res = { name: `${this.namespace}.${typeName}`, typeVal: type }
      } catch (error) {
        info('jsonc 获取类型失败')
        console.warn(error)
        res = { name: '', typeVal: ''}
      }
    }
    return res
  }
}

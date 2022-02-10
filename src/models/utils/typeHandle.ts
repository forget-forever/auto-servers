/*
 * @Author: zml
 * @Date: 2022-02-10 15:59:34
 * @LastEditTime: 2022-02-10 17:45:51
 */
import { compileType } from "@/utils";
import { SchemaBody } from "../create/detailType";

/**
 * 得到类型字符串
 * @param schema 类型的schema对象
 * @param startRoot 开始节点
 * @param typeName 生成的类型名称
 */
export const getType = async (schema: SchemaBody, startRoot: string, typeName: string) => {
  if(schema.type === 'object') {
    // 如果没有properties schhema异常
    if (!schema.properties) return Promise.reject(Error('json schema 异常'))

    const keys = Object.keys(schema.properties || {})
    if(keys.includes(startRoot)) {
      return compileType(schema.properties[startRoot], typeName)
    }
    let res = ''
    for(const k in keys) {
      try {
        res = await getType(schema.properties[k], startRoot, typeName)
        break;
      } catch (error) {
        res = await getType(schema.properties[k], startRoot, typeName)
      }
    }
    if (res) {
      return res
    }
    return Promise.reject(Error('生成类型失败'))
  }
  return Promise.reject(Error('生成类型失败'))
}

/**
 * 得到类型字符串
 * @param schema 类型的schema对象
 * @param name 节点名称，如果要直接生成那就 节点名称 和 开始节点 同名
 * @param startRoot 开始节点
 * @param typeName 生成的类型名称
 */
export const createType = async (schema: SchemaBody, name: string, startRoot: string, typeName: string) => {
  let typeStr = ''
  if (name === startRoot) {
    typeStr = await compileType(schema, typeName)
  } else {
    typeStr = await getType(schema, startRoot, typeName)
  }
}
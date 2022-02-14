/*
 * @Author: zml
 * @Date: 2022-02-10 15:59:34
 * @LastEditTime: 2022-02-11 16:33:22
 */
import config from "@/config";
import { compileType, info } from "@/utils";
import { getConfig } from "@/utils/config";
import chalk from "chalk";
import { upperFirst } from "lodash";
import { getFunctionName } from ".";
import { ApiDetail, SchemaBody } from "../create/detailType";

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
      return compileType(schema.properties[startRoot], typeName)
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
export const addType = async (schema: SchemaBody, name: string, startRoot: string, typeName: string) => {
  let typeStr: string | undefined = ''
  if (name === startRoot) {
    typeStr = await compileType(schema, typeName)
  } else {
    typeStr = await getType(schema, startRoot, typeName)
  }
  if (typeStr) {
    return typeStr
  }
  return Promise.reject(Error('类型添加失败'))
}

/**
 * 生成类型
 * @param api api的详细数据
 */
export const createType = async (api: ApiDetail<'obj'>, dest: string) => {
  const name = getFunctionName(api)

  const paramsTypeName = upperFirst(`${name}Params`)
  const dataTypeName = upperFirst(`${name}Data`)
  const resTypeName = upperFirst(`${name}Res`)

  return {paramsTypeName, dataTypeName, resTypeName}
}

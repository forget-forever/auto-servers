/*
 * @Author: zml
 * @Date: 2022-02-10 15:59:34
 * @LastEditTime: 2022-02-28 15:41:13
 */
import { info } from "@/utils";
import { getConfig } from "@/utils/config";
import jsonc2type from "@/utils/jsonc2type";
import { upperFirst } from "lodash";
import { getFunctionName } from ".";
import { ApiDetail, SchemaBody } from "../type/detailType";
import { createQuerySchema, getTypeStr } from "./getTypeStr";
import { pushType } from "./typeFileHandle";

type GetTypeArgs = {
  key: 'Params' | 'Res' | 'Data',
  name?: string,
  mod?: 'jsonc' | 'schema',
  startNode?: string,
  schema?: SchemaBody,
  str?: string
}
class ParseType {
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

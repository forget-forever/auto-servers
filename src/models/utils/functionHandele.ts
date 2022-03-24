/*
 * @Author: zml
 * @Date: 2022-02-09 15:27:10
 * @LastEditTime: 2022-03-17 17:53:37
 */
import { getConfig } from "@as-src/utils/config"
import { readFileSync, writeFileSync } from "fs"
import { compileFunction, CreateFunctionParams, paramsPreHandle, requestDataPreHandle, urlPreHandle } from "./compileFunction"
import { getExportType } from "./typeFileHandle"

export const getFunctionFileTpl = (namespace = getConfig('typeNamespace')) => {
  const configModel = getConfig('importModel').map((item) => item.replace(/;/g, ''))
  const extendName = getConfig('extendName')
  if (extendName.includes('ts') && getExportType() === 'export') {
    configModel.push(`import type * as ${namespace} from './type'`)
  }
  if (configModel.length) {
    return configModel.join(';\n') + ';\n\n'
  }
  return ''
}

/**
 * 将方法放入文件中
 * @param name 方法名
 * @param body 方法的内容
 * @param src 放入的路径
 * @param comment 方法的注释
 */
export const pushFunction = (name: string, body: string, src: string, comment?: string) => {
  let content = readFileSync(src, 'utf-8')
  if (comment) {
    content += `/** ${comment} */\n`
  }
  writeFileSync(src, `${content}export const ${name} = ${body}\n\n`)
}

/**
 * 生成js / ts方法
 * @param api 接口的数据
 * @returns 
 */
export const createFunction = (api: CreateFunctionParams) => {
  const serversTemplate = getConfig('serviceTemplate')
  let resModel = ''
  if (typeof serversTemplate === 'string') {
    resModel = serversTemplate
  }else {
    resModel = serversTemplate({
      ...api,
      paramsHandle: paramsPreHandle,
      requestDataHandle: requestDataPreHandle,
      method: api.apiDetail.method,
      urlHandle: urlPreHandle,
      url: api.apiDetail.path
    })
  }

  return compileFunction(resModel, api)
}

/*
 * @Author: zml
 * @Date: 2022-02-09 15:27:10
 * @LastEditTime: 2022-02-21 14:46:38
 */
import { getConfig } from "@/utils/config"
import { readFileSync, writeFileSync } from "fs"
import { getExportType } from "./typeFileHandle"

export const getFunctionFileTpl = (namespace = getConfig('typeNamespace')) => {
  const configModel = getConfig('importModel').map((item) => item.replace(/;/g, ''))
  const extendName = getConfig('extendName')
  if (extendName.includes('ts') && getExportType() === 'export') {
    configModel.push(`import * as ${namespace} from './type'`)
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

const createTplStr = (str = '', params: string) => '${' + `${params}.${str}` + '}'

/**
 * 路径的预处理函数，解决一些路由传参
 * @param url 路径
 * @param params 参数名
 * @returns 处理后的参数
 */
export const urlPreHandle = (url: string, params = 'params') => {
  const braketsReg = /\{(\w)+\}/g
  const colonReg = /(:)(\w)+/g
  let res = ''
  res = url.replace(braketsReg, (match) => {
    const item = match.match(/(?<=\{)((\w)*)(?=\})/g) || ['']
    if (item[0]) {
      return createTplStr(item[0], params)
    }
    return match
  })
  res = res.replace(colonReg, (match) => {
    const item = match.match(/(?<=:)(\w)+/g) || ['']
    if(item[0]) {
      return createTplStr(item[0], params)
    }
    return match
  })
  return res
}

/**
 * 参数的预处理
 * @param paramsType query参数类型
 * @param dataType 请求体data类型
 * @returns 
 */
export const paramsPreHandle = (paramsType = '', dataType = '', params = 'params', data = 'data') => {
  let res = ''
  if (paramsType) {
    res += `${params}: ${paramsType}, `
  }
  if (dataType) {
    res += `${data}: ${dataType}`
  }
  return res
}

export const requestDataPreHandle = (paramsType = '', dataType = '', params = 'params', data = 'data') => {
  return `${paramsType ? ` ${params},` : ''}${dataType ? ` ${data},`: '' }`
}

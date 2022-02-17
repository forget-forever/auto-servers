/*
 * @Author: zml
 * @Date: 2022-02-09 15:27:10
 * @LastEditTime: 2022-02-11 16:16:42
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
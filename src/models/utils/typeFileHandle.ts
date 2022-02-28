/*
 * @Author: zml
 * @Date: 2022-02-11 17:29:23
 * @LastEditTime: 2022-02-24 17:39:55
 */
import config from "@/config"
import { deleteNullStr, info } from "@/utils"
import { getConfig } from "@/utils/config"
import chalk from "chalk"
import { readFileSync, writeFileSync } from "fs"

type ExportType = typeof config.exportTypeRequire[number]

/**
 * 校验导出方式是否合法
 * @param type 导出方式
 * @returns 
 */
const validatorExportType = (type: string): type is ExportType => {
  const { exportTypeRequire } = config
  if (!exportTypeRequire.includes(type as ExportType)) {
    info(`类型导出方式错误，只支持 ${chalk.red(exportTypeRequire.join('、'))} ${exportTypeRequire.length}种格式`, 'all', true)
    return false
  }
  return true
}
/**
 * 获取导出方式，会检验，如果不合法会结束进程
 * @returns 
 */
export const getExportType = (): ExportType => {
  const exportType = getConfig('exportType')
  if (validatorExportType(exportType)) {
    return exportType
  }
  return 'export'
}

const getTypeTpl = () => {
  const baseModel = (getConfig('importTypeModel') || []).map((item) => item.replace(/;/g, ''))
  if (baseModel.length) {
    return baseModel.join(';\n') + ';\n'
  }
  return ''
}

/**
 * 生成类型文件的字符串
 * @param initVal 类型的内容
 * @param type 导出方式
 * @param namespace 命名空间
 * @param tpl 基础模版
 * @returns 
 */
export const newTypeFile = (
  initVal = '',
  type: ExportType = getExportType(),
  namespace: string = getConfig('typeNamespace'),
  tpl = getTypeTpl()
) => {
  const val = deleteNullStr(initVal)
  const template = deleteNullStr(tpl)
  if (type === 'declare') {
    const beautify = require('js-beautify').js
    if (template) {
      return beautify(`${template}\n
        declare global {
          declare namespace ${namespace} {
            ${val}
          }
        }\n`,
        { indent_size: 2, space_in_empty_paren: true, space_before_conditional: true }
      ).replace(/(\s)+\?(\s)+/g, '?').replace(/\}(\s)+\[/g, '}[')
    }
    return beautify(`declare namespace ${namespace} {
        ${val}
      }\n`,
      { indent_size: 2, space_in_empty_paren: true, space_before_conditional: true }
    ).replace(/(\s)+\?(\s)+/g, '?').replace(/\}(\s)+\[/g, '}[')
  }
  return `${template}${template ? '\n\n' : ''}${val}\n`
}

const getTypeFile = (dest: string) => {
  return readFileSync(dest, 'utf-8');
}

type GetContentType =  (dest: string, namespace: string) => {
  /** 类型的内容 */
  content: string;
  /** 写入内容 */
  setContent: (content: string) => void;
  /** 该文件的声明形式 */
  type: ExportType
  /** 命名空间 */
  namespace: string
}

/**
 * 获取类型文件的内容
 * @param dest 目标文件
 * @param namespace 命名空间
 * @returns 
 */
export const getContent: GetContentType = (dest, namespace) => {
  const content = getTypeFile(dest);
  const res = { } as ReturnType<GetContentType>
  /** 全局命名空间的正则 */
  const globalReg = /(?<=(declare global)( )*{)(.*)(?=})/s
   /** 获取自定义的命名空间的正则 */
  const namespaceReg = new RegExp(`(?<=declare( )+namespace( )+${namespace}( )*{)(.*)(?=})`, 's' )
  if (namespaceReg.test(content)) {
    /** declare的导出形式 */

    /** 全局命名空间 */
    const [globalContent] = content.match(globalReg) || ['']
    // 识别该文件是declare形式的导出形式
    const baseContentReg = /((.*)(?=(declare global)( )*{))/s
    
    /** 基础数据 */
    const [baseContent] = content.match(baseContentReg) || ['']

    /** 自定义命名空间 */
    const namespaceContentArr = (globalContent || content).match(namespaceReg)
    if (!namespaceContentArr) {
      info(`${chalk.redBright(dest)} 文件读取出错，请检查文件！`, 'all', true)
    }
    [res.content] = namespaceContentArr || ['']
    res.type = 'declare'
    res.setContent = (newContent) => {
      writeFileSync(dest, newTypeFile(newContent, 'declare', namespace, baseContent))
    }
    res.namespace = namespace
  } else {
    /** export的导出形式 */
    res.type = 'export'
    res.content = content
    res.setContent = (newContent) => {
      writeFileSync(dest, newContent)
    }
    res.namespace = namespace
  }
  return res
}

export const pushType = (typeArr: string[], dest: string, namespace: string) => {
  const { content, setContent, type } = getContent(dest, namespace)
  if (type === 'export') {
    const typeStr = typeArr.filter((item) => !!item).map((ele) => `${type} ${ele}`).join('\n\n')
    setContent(`${content}\n${typeStr}`)
  } else {
    setContent(`${content}\n${typeArr.join('\n')}`)
  }
  return { namespace, type }
}
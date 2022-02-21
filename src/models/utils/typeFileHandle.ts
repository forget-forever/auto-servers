/*
 * @Author: zml
 * @Date: 2022-02-11 17:29:23
 * @LastEditTime: 2022-02-21 15:23:37
 */
import config from "@/config"
import { info } from "@/utils"
import { getConfig } from "@/utils/config"
import chalk from "chalk"
import { readFileSync, writeFileSync } from "fs"

type ExportType = typeof config.exportTypeRequire[number]

const validatorExportType = (type: string): type is ExportType => {
  const { exportTypeRequire } = config
  if (!exportTypeRequire.includes(type as ExportType)) {
    info(`类型导出方式错误，只支持 ${chalk.red(exportTypeRequire.join('、'))} ${exportTypeRequire.length}种格式`, 'all', true)
    return false
  }
  return true
}

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

export const newTypeFile = (
  initVal = '',
  type: ExportType = getExportType(),
  namespace: string = getConfig('typeNamespace'),
  tpl = getTypeTpl()
) => {
  const val = initVal.replace(/^\n*|\n*$/g, '')
  if (type === 'declare') {
    const beautify = require('js-beautify').js
    return beautify(`${tpl.replace(/^\n*|\n*$/g, '')}
        declare global {
        declare namespace ${namespace} {
          ${val}
        }
      }`,
      { indent_size: 2, space_in_empty_paren: true, space_before_conditional: true }
    ).replace(/(\s)+\?(\s)+/g, '?').replace(/\}(\s)+\[/g, '}[')
  }
  return `${tpl.replace(/^\n*|\n*$/g, '')}${tpl ? '\n\n' : ''}${val}`
}

const getTypeFile = (dest: string) => {
  return readFileSync(dest, 'utf-8');
}

const getNamespace = (content: string) => {
  const reg1 = /(?<=(declare namespace ))(.*)(?={)/
  const reg2 = /(?<=(import(\s)+\*(\s)+as ))(.*)(?=((\s)+from))/g
  return (content.match(reg1) || content.match(reg2) || [getConfig('typeNamespace')])[0].trim()
}

type GetContentType =  (dest: string) => {
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
 * @returns 
 */
export const getContent: GetContentType = (dest) => {
  const content = getTypeFile(dest);
  const res = { } as ReturnType<GetContentType>
  /** 全局命名空间的正则 */
  const globalReg = /(?<=(declare global)( )*{)(.*)(?=})/s
  const namespace = getNamespace(content)
  if (globalReg.test(content)) {
    /** 全局命名空间 */
    const [globalContent] = content.match(globalReg) || ['']
    /** 命名空间 */
    /** 获取自定义的命名空间的正则 */
    const namespaceReg = new RegExp(`(?<=declare namespace ${namespace}( )*{)(.*)(?=})`, 's' )
    // 识别该文件是declare形式的导出形式
    const baseContentReg = /((.*)(?=(declare global)( )*{))/s
    
    /** 基础数据 */
    const [baseContent] = content.match(baseContentReg) || ['']

    /** 自定义命名空间 */
    const namespaceContentArr = globalContent.match(namespaceReg)
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
    res.type = 'export'
    res.content = content
    res.setContent = (newContent) => {
      writeFileSync(dest, newContent)
    }
    res.namespace = namespace
  }
  return res
}

export const pushType = (typeArr: string[], dest: string) => {
  const { content, setContent, type, namespace } = getContent(dest)
  if (type === 'export') {
    const typeStr = typeArr.map((ele) => `${type} ${ele}`).join('\n\n')
    setContent(`${content}\n${typeStr}`)
  } else {
    setContent(`${content}\n${typeArr.join('\n')}`)
  }
  return { namespace, type }
}
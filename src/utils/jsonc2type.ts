/*
 * @Author: zml
 * @Date: 2022-02-25 18:57:05
 * @LastEditTime: 2022-02-28 20:21:01
 */
import { upperFirst } from "lodash"
import typeofJsonc from "typeof-jsonc"
import { deleteNullStr } from "."

const basicType = ['string', 'number', 'boolean', "", 'any', 'unknown', 'never', 'object', 'Object', 'undefined', 'null',]

const isArrReg = /\w+\[\]$/

const splitType = (str: string, typeName: string): string => {
  // const interfaceReg = new RegExp(`(?<=interface( )+${typeName.trim()}( )+)(.[\\s\\S]*?)(?=.*(((export)|(declare))?( )+interface)|$)`, 'g')
  // const typeReg = new RegExp(`(?<=declare( )+type( )+${typeName.trim()}( )+=)(.[\\s\\S]*?)(?=.)`)
  // console.log(typeName)
  const startReg = new RegExp(`(?<=(interface( )+${typeName.trim()}( )+)|(type( )+${typeName.trim()}( )*=( )*))(.[\\s\\S]*?)(?=(export)|(declare)|$)`, 'g')
  const [res] = str.match(startReg) || ['']
  const resVal = deleteNullStr(res)
  if (/\w+;?$/.test(resVal) && !basicType.includes(resVal)) {
    return splitType(str, resVal.replace(/;/g, ''))
  }
  return resVal
}

type IOptions = {
  startNode: string;
  name: string;
}

type TypeParseStr = string;

/**
 * 整理类型，将多个类型重新整合成一个
 * @param parseStr 单个类型
 * @param typeStr 分散的类型字符串
 * @returns 
 */
const parseType = (parseStr: string, typeStr: string): TypeParseStr => {
  return parseStr.replace(/(?<=\w(\?)?:\s+)(.[\w\s|[\]]*)(?=;[\n\\n]?(\t)?)/gs, (subStr) => {
    const subArr = subStr.split('|')
    return subArr.map((item) => {
      let ele = item.trim()
      let suffix = ''
      if (isArrReg.test(ele)) {
        ele = ele.replace(/[[\]]/g, '')
        suffix = '[]'
      }
      if (basicType.includes(ele)) {
        return `${ele}${suffix}`
      }
      return `${parseType(splitType(typeStr, ele), typeStr)}${suffix}`
    }).join(' | ')
  }).replace(/;$/, '')
}

const jsonc2type = (jsonc: string, options: IOptions) => {
  const { name, startNode } = options
  const type = typeofJsonc(jsonc, name, { addExport: false, singleLineJsDocComments: true })
  const typeStr = parseType(splitType(type, upperFirst(startNode)), type)
  // const strtReg = new RegExp(//)
  if (!typeStr) {
    return ''
  }
  return `type ${name} = ${typeStr};`
}

export default jsonc2type
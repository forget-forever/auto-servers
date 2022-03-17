import { ConfigApi } from "as-config"

/*
 * @Author: zml
 * @Date: 2022-03-17 14:23:11
 * @LastEditTime: 2022-03-17 17:55:03
 */
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
  let res = url
  let tplStr = "'"
  res = res.replace(braketsReg, (match) => {
    const item = match.match(/(?<=\{)((\w)*)(?=\})/g) || ['']
    if (item[0]) {
      tplStr = '`'
      return createTplStr(item[0], params)
    }
    return match
  })
  res = res.replace(colonReg, (match) => {
    const item = match.match(/(?<=:)(\w)+/g) || ['']
    if(item[0]) {
      tplStr = '`'
      return createTplStr(item[0], params)
    }
    return match
  })

  return `${tplStr}${res}${tplStr}`
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
    res += `${params}: ${paramsType},`
  }
  if (dataType) {
    res += ` ${data}: ${dataType}`
  }
  return res
}

export type CreateFunctionParams = Pick<ConfigApi, 'apiDetail' | 'dataType' | 'paramsType' | 'responseType'>

export const requestDataPreHandle = (paramsType = '', dataType = '', params = 'params', data = 'data') => {
  return `${paramsType ? ` ${params},` : ''}${dataType ? ` ${data},`: '' }`
}

const curlName = (str: string) => {
  const reg = /((\w)+)/
  const resArr = str.match(reg) || ['']
  return resArr[0]
}

const curlParamDataName = (resModel: string, num: number) => {
  const queryReg = /(?<=\()(.*?)(?=\))/gs
  const queryStr = resModel.match(queryReg) || ['']
  return curlName(queryStr[0].split(',')[num] || '') || 'undefined'
}

/**
 * 将自定义的语法糖编译成js / ts方法
 * @param resModel 带语法糖关键字的字符串
 * @param api api的一些信息
 * @returns js / ts方法
 */
export const compileFunction = (resModel: string, api: CreateFunctionParams) => {
  const {paramsType, dataType, responseType, apiDetail} = api
  const grammarMap: Record<string, () => string> = {
    '$RequestQuery': () => paramsPreHandle(paramsType, dataType),
    '$ResponseType': () => responseType,
    '$Method': () => `'${apiDetail.method}'` || `'GET'`,
    '$Url': () => urlPreHandle(apiDetail.path),
  }
  const jitGrammarMap: Record<string, (actual: string) => string>= {
    '$Prams': (actual) => curlParamDataName(actual, 0),
    '$Data': (actual) => curlParamDataName(actual, 1)
  }
  const grammarReg = new RegExp(Object.keys(grammarMap).map((item) => `(\\${item})`).join('|'), 'gs')
  let res = resModel.replace(grammarReg, (match) => {
    return (grammarMap[match] && grammarMap[match]()) || match
  })
  res = res.replace(/((\w)+(\s)*:[\s\n]*(undefined)(,)*)|(<>)/gs, '')
  const jitReg = new RegExp(Object.keys(jitGrammarMap).map((item) => `(\\${item})`).join('|'), 'gs')
  res = res.replace(jitReg, (match) => {
    return (jitGrammarMap[match] && jitGrammarMap[match](res)) || undefined + ''
  })
  res = res.replace(/((\w)+(\s)*:[\s\n]*(undefined)(,)*)|(<>)/gs, '')
  return res
}
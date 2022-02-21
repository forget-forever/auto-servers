/*
 * @Author: zml
 * @Date: 2022-01-12 11:16:39
 * @LastEditTime: 2022-02-21 15:59:39
 */
module.exports = {
  // 项目id
  projectId: 132,
  // yapi的mock地址，写上域名就够了，例如：http://yapi.sfjswl.com
  mockUrl: "http://yapi.sfjswl.com",
  // 项目token
  token: "afb8d3ceb74453d513f73b451b1f404dda763479e18349ffb1bb6e9373ce9695",
  // 接口集合，通过yapi上的tag和分类来区分集合,是数组的时候识别为tag，字符串的时候识别为分类
  collections: {
    test: ["3.2"]
  },
  /** 生成请求的目录 */
  outPath: "apis",
  /** 引入的model */
  importModel: ["import request from '@/utils/request'"],
  /**
   * 生成的方法模版`
   * @param {{
   *  url: string, // 接口的url
   *  paramsType: string, // query请求参数类型
   *  dataType: string, // 请求体的参数类型
   *  returnType: string, // 返回的结果类型
   *  method: string, // 请求方式
   *  paramsHandle: (paramsType = '', dataType = '', params = 'params', data = 'data') => string, // 参数的预处理
   *  requestDataHandle: (paramsType?: string, dataType?: string, , params = 'params', data = 'data') => string, // 请求参数的预处理
   *  urlHandle: (url: string, params = 'params') => string, // 内置的路径预处理函数，处理路由传参
   *  apiDetail: import("@/models/create/detailType").ApiDetail<'obj'> // 接口的详情
   * }} api
   * @returns {string} 方法字符串
   */
  serviceTemplate: (api) => {
    const {url, paramsType, dataType, returnType, method, paramsHandle,  urlHandle, requestDataHandle, apiDetail} = api
    return (
      `(${paramsHandle(paramsType, dataType)}) => 
  request${returnType? `<${returnType}>` : ''}('${urlHandle(url)}', {${requestDataHandle(paramsType, dataType)} method: '${method}' })`
    )
  },
  // 返回的参数解析类型的节点，默认是data节点开始解析
  typeRootNode: "data",
  // 类型的导出形式，分为 declare 和 export两种
  exportType:  "declare",
  /** 默认的接口分类 */
  defaultApisType: 'utils'
}
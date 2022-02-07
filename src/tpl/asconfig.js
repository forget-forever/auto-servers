/*
 * @Author: zml
 * @Date: 2021-12-29 15:35:22
 * @LastEditTime: 2022-01-29 14:34:23
 */
module.exports = {
  // 项目id
  projectId: "",
  // yapi的mock地址，写上域名就够了，例如：http://yapi.sfjswl.com
  mockUrl: "http://yapi.sfjswl.com",
  // 项目token
  token: "",
  // 接口集合，通过yapi上的tag和分类来区分集合,是数组的时候识别为tag，字符串的时候识别为分类
  collections: {
    // test集合，含有3.2和utils的tag为一个集合
    test: ["3.2", "utils"]
  },
  /** 生成请求的目录 */
  outPath: "servers",
  /** 引入的model */
  importModel: ["import request from '@/utils/request'"],
  /**
   * 生成的方法模版，默认是：(paramsType, ReturnType, option, url) => `(params: ${paramsType}) => request<${ReturnType}>(${url}, ${option})`
   * @param {*} url 接口的url
   * @param {*} paramsType query请求参数类型
   * @param {*} dataType 请求体的参数类型
   * @param {*} ReturnType 返回的结果类型
   * @param {*} method 请求方式
   * @param {*} apiDetail 接口的详情
   * @returns 
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serveiceTemplate: (url, paramsType, dataType, ReturnType, method, apiDetail) => {
    let params = ''
    if (paramsType) {
      params += `params: ${paramsType}, `
    }
    if (dataType) {
      params += `data: ${dataType}`
    }
    return (
      `(${params}) => 
        request<${ReturnType}>(${url}, {params, method: ${method}, data})`
    ) 
  },
  // 返回的参数解析类型的节点，默认是data节点开始解析
  typeRootNode: "data",
  // 生成的文件的拓展名，分为.js 和 .ts
  extendName: ".ts",
  // 是否需要生成ts类型
  tsType: true,
  // 类型的导出形式，分为declare 和 export两种
  exportType: "declare",
  /** 默认的接口分类 */
  defaultApisType: 'utils'
}
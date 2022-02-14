/*
 * @Author: zml
 * @Date: 2021-12-29 15:35:22
 * @LastEditTime: 2022-02-11 15:46:59
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
module.exports = {
  // 项目id
  projectId: "",
  // yapi的mock地址，写上域名就够了，例如：http://yapi.sfjswl.com
  mockUrl: "http://yapi.sfjswl.com",
  // 项目token
  token: "",
  /** 引入的model */
  importModel: ["import request from '@/utils/request'"],
  // 接口集合，通过yapi上的tag和分类来区分集合,是数组的时候识别为tag，字符串的时候识别为分类
  collections: {
    // test集合，含有3.2和utils的tag为一个集合
    test: ["3.2", "utils"]
  },
  /** 生成请求的目录 */
  outPath: "servers",
  /** 类型文件中引入的model */
  importTypeModel: undefined,
  /**
   * 生成的方法模版`
   * @param {string} url 接口的url
   * @param {string} paramsType query请求参数类型
   * @param {string} dataType 请求体的参数类型
   * @param {string} returnType 返回的结果类型
   * @param {string} method 请求方式
   * @param {import("@/models/create/detailType").ApiDetail<'obj'>} apiDetail 接口的详情
   * @returns {string} 方法字符串
   */
  serviceTemplate: (url, paramsType, dataType, returnType, method, apiDetail) => {
    let params = ''
    if (paramsType) {
      params += `params: ${paramsType}, `
    }
    if (dataType) {
      params += `data: ${dataType}`
    }
    return (
      `(${params}) => 
  request<${returnType}>('${url}', {params, method: '${method}', ${dataType ? 'data': ''}})`
    )
  },
  // 返回的参数解析类型的节点，默认是data节点开始解析
  typeRootNode: "data",
  // 生成的文件的拓展名，分为.js 和 .ts
  extendName: ".ts",
  // 是否需要生成ts类型, 默认为true
  tsType: true,
  // 类型的导出形式，分为 declare 和 export两种
  exportType:  "export",
  // 类型的命名空间
  typeNamespace: 'Request',
  /** 默认的接口分类 */
  defaultApisType: 'utils'
}
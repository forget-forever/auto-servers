/*
 * @Author: zml
 * @Date: 2022-02-24 19:57:23
 * @LastEditTime: 2022-02-24 19:59:20
 */
module.exports = {
  projectId: "52",
  token: "b795f1bd91257f3a20fbca40da378b6ca1d441cbf84ddd71649c57a5d2bca4d0", /** 项目的token */
  importModel: ["import { Request } from '@/lib/request/request';"], /** 引入的model */
  // importTypeModel: [], /** 类型文件中引入的model */
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
  //   return (
  //     `(${paramsHandle(paramsType, dataType)}) => 
  // request${returnType? `<${returnType}>` : ''}(${urlHandle(url)}, {${requestDataHandle(paramsType, dataType)} method: '${method}' })`
  //   )
    return (
      `(${paramsHandle(paramsType, dataType)}) => 
  Request${returnType? `<${returnType}>` : ''}(
    {
      url: ${urlHandle(url)},
      method: '${method}',
    },
    {${paramsType ? ' ...params,' : ''}${dataType ? ' ...data' : ''} },
  );`
    )
  },
  outPath: "serversTest", /** 生成请求的目录 */
}
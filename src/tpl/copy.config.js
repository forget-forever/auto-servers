module.exports = {
  projectId: "", /** 项目id */

  token: "", /** 项目的token */
  
  importModel: ["import request from '@/utils/request'"], /** 引入的model */

  // importTypeModel: [], /** 类型文件中引入的model */

  /**
   * 生成的方法模版`
   * @param {string} url 接口的url
   * @param {string} paramsType query请求参数类型
   * @param {string} dataType 请求体的参数类型
   * @param {string} ReturnType 返回的结果类型
   * @param {string} method 请求方式
   * @param {import("@/models/create/detailType").ApiDetail<'obj'>} apiDetail 接口的详情
   * @returns {string} 方法字符串
   */
  // serviceTemplate: (url, paramsType, dataType, returnType, method, apiDetail) => {
  //   let params = ''
  //   if (paramsType) {
  //     params += `params: ${paramsType}, `
  //   }
  //   if (dataType) {
  //     params += `data: ${dataType}`
  //   }
  //   return (
  //     `(${params}) => 
  // request<${returnType}>('${url}', {params, method: '${method}', ${dataType ? 'data': ''}})`
  //   )
  // },

  // mockUrl: "http://yapi.sfjswl.com", /** yapi的mock地址，写上域名就够了，例如：http://yapi.sfjswl.com */

  // 接口集合，通过yapi上的tag和分类来区分集合,是数组的时候识别为tag，字符串的时候识别为分类
  // collections: {
  //   // test集合，含有3.2和utils的tag为一个集合
  //   test: ["3.2", "utils"]
  // },
  
  // outPath: "servers", /** 生成请求的目录 */

  // typeRootNode: "data", /** 返回的参数解析类型的节点，默认是data节点开始解析 */

  // extendName: ".ts", /** 生成的文件的拓展名，分为.js 和 .ts */

  // tsType: true, /** 是否需要生成ts类型, 默认为true */

  // exportType: "export", /** 类型的导出形式，分为declare 和 export两种 */

  // typeNamespace: 'Request', /** 类型的命名空间 */

  // defaultApisType: 'utils' /** 默认的接口分类 */
}
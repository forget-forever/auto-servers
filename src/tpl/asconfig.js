/*
 * @Author: zml
 * @Date: 2021-12-29 15:35:22
 * @LastEditTime: 2022-04-30 15:47:23
 */

/** @type {import("as-config").AsConfig} */
module.exports = {
  // 项目id
  projectId: "",
  // yapi的mock地址，写上域名就够了，例如：http://yapi.xxxxxxx.com
  mockUrl: "http://yapi.xxxxx.com",
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
  outPath: "src/servers",
  /** 类型文件中引入的model */
  importTypeModel: [],
  /** 生成的方法模版`*/
  serviceTemplate: `($RequestQuery) => request<$ResponseType>($Url, { params: $Params, data: $Data, method: $Method})`,
  // serviceTemplate: (api) => {
  //   const {url, paramsType, dataType, returnType, method, paramsHandle,  urlHandle, requestDataHandle} = api
  //   return (
  //     `(${paramsHandle(paramsType, dataType)}) => 
  // request${returnType? `<${returnType}>` : ''}(${urlHandle(url)}, {${requestDataHandle(paramsType, dataType)} method: '${method}' })`
  //   )
  // },
  // 返回的参数解析类型的节点，默认是data节点开始解析
  typeRootNode: "data",
  // 生成的文件的拓展名，分为.js 和 .ts
  extendName: ".ts",
  // 是否需要生成ts类型, 默认为true
  tsType: true,
  // 类型的导出形式，分为 declare 和 export两种
  exportType:  "declare",
  // 类型的命名空间
  typeNamespace: 'Request',
  /** 默认的接口分类 */
  defaultApisType: 'utils'
}
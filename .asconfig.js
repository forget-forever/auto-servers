/*
 * @Author: zml
 * @Date: 2022-01-12 11:16:39
 * @LastEditTime: 2022-04-30 15:44:41
 */
/** @type {import('as-config').AsConfig} */
module.exports = {
  // 项目id
  projectId: 132,
  // yapi的mock地址，写上域名就够了
  mockUrl: "",
  // 项目token
  token: "afb8d3ceb74453dxxxxxxxx",
  // 接口集合，通过yapi上的tag和分类来区分集合,是数组的时候识别为tag，字符串的时候识别为分类
  collections: {
    test: ["3.2"]
  },
  /** 生成请求的目录 */
  outPath: "apis",
  /** 引入的model */
  importModel: ["import request from '@/utils/request'"],
  // importTypeModel: ["import enum from '@/utils/enum'"],
  /**
   * 生成的方法模版` */
  // serviceTemplate: (api) => {
  //   const {url, paramsType, dataType, responseType , method, paramsHandle,  urlHandle, requestDataHandle, apiDetail} = api
  //   return (
  //     `(${paramsHandle(paramsType, dataType)}) => 
  // request<$ResponseType>($Url, { params: $Params, data: $Data, method: $Method })`
  //   )
  // },
  // 返回的参数解析类型的节点，默认是data节点开始解析
  typeRootNode: "data",
  // 类型的导出形式，分为 declare 和 export两种
  exportType:  "declare",
  /** 默认的接口分类 */
  defaultApisType: 'utils'
}

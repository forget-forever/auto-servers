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
  outPath: "",
  /** 引入的model */
  importModel: ["import request from '@/utils/request'"],
  // 生成的方法模版，默认是：(${params}) => request<${ReturnType}>(${url}, ${option})
  serveiceTemplate: "(${params}) => request<${ReturnType}>(${url}, ${option})",
  // 返回的参数解析类型的节点，默认是data节点开始解析
  typeRootNode: "data",
  /** 默认的接口分类 */
  defaultApisType: 'utils'
}
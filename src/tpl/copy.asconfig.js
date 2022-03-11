/** @type {import("as-config").AsConfig} */
module.exports = {
  projectId: "",
  token: "",

  // importModel: ["import request from '@/utils/request'"],

  importTypeModel: [],

  // serviceTemplate: (api) => {
  //   const {url, paramsType, dataType, returnType, method, paramsHandle,  urlHandle, requestDataHandle, apiDetail} = api
  //   return (
  //     `(${paramsHandle(paramsType, dataType)}) => 
  // request${returnType? `<${returnType}>` : ''}(${urlHandle(url)}, {${requestDataHandle(paramsType, dataType)} method: '${method}' })`
  //   )
  // },

  // mockUrl: "http://yapi.sfjswl.com", 

  // collections: {
  //   // test集合，含有3.2和utils的tag为一个集合
  //   test: ["3.2", "utils"]
  // },

  // outPath: "src/servers",

  // typeRootNode: "data", 
  
  // extendName: ".ts",

  // tsType: true,

  exportType: "export",

  // typeNamespace: 'Request',
  
  // defaultApisType: 'utils'
}
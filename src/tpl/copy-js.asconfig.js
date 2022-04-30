/** @type {import("as-config").AsConfig} */
module.exports = {
  projectId: "",

  token: "",

  tsType: false,

  importModel: ["import request from '@/utils/request'"],

  serviceTemplate: (options) => {
    const { method } = options
    return `(data) => request($Url, { ${method.toUpperCase() === 'GET' ? 'params' : 'data'}: data, method: $Method})`
  },

  extendName: ".js",

  // collections: {
  //   // test集合，含有3.2和utils的tag为一个集合
  //   test: ["3.2", "utils"]
  // },

  // mockUrl: "http://yapi.xxxx.com", 

  // outPath: "src/servers",

  // defaultApisType: 'utils'

  // importTypeModel: [],

  // typeRootNode: "data", 

  // typeNamespace: 'Request',
  
}
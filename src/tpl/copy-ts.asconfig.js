/** @type {import("as-config").AsConfig} */
module.exports = {
  projectId: "",
  
  token: "",

  importModel: ["import request from '@/utils/request'"],

  // importTypeModel: [],

  serviceTemplate: `($RequestQuery) => request<$ResponseType>($Url, { params: $Prams, data: $Data, method: $Method})`,

  exportType: "export",

  extendName: ".ts",

  tsType: true,

  // mockUrl: "http://yapi.sfjswl.com", 

  // collections: {
  //   // test集合，含有3.2和utils的tag为一个集合
  //   test: ["3.2", "utils"]
  // },

  // outPath: "src/servers",

  // typeRootNode: "data", 

  // typeNamespace: 'Request',
  
  // defaultApisType: 'utils'
}
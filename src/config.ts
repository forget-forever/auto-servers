import type asc from './tpl/asconfig'

export default {
  /** 有道翻译url */
  translateUrl: 'https://aidemo.youdao.com/trans',
  /** 用户配置文件的必填项 */
  requiredConfig: ['token', 'projectId'] as (keyof typeof asc)[],
  /** 分类控制匹配时的相似度阀值 */
  similarThreshold: 0.9,
  /** 默认的配置文件名称 */
  defalutConfigName: '.asconfig.js' as string,
  /** 获取yapi上的接口详情的url */
  interfaceDetailUrl: '/api/interface/get',
  /** 获取接口的列表的url */
  interfaceListUrl: '/api/interface/list_menu',
  /** 项目的根路径 */
  rootDir: __dirname,
  /** 类型导出方式要求 */
  exportTypeRequire: ['export', 'declare']
} as const
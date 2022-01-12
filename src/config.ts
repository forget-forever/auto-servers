import type asc from './tpl/as.config.json'

export default {
  /** 有道翻译url */
  translateUrl: 'https://aidemo.youdao.com/trans',
  /** 用户配置文件的必填项 */
  requiredConfig: ['mockUrl', 'token', 'projectId'] as (keyof typeof asc)[],
  /** 分类控制匹配时的相似度阀值 */
  similarThreshold: 0.9
} as const
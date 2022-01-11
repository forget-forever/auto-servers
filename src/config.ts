import type asc from './tpl/as.config.json'

export default {
  /** 有道翻译url */
  translateUrl: 'https://aidemo.youdao.com/trans',
  /** 用户配置文件的必填项 */
  requiredConfig: ['mockUrl', 'token'] as (keyof typeof asc)[]
} as const
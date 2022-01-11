import { readFileSync } from "fs";
import { resolve } from "path";
import type asc from '../tpl/as.config.json'
import stripJsonComments from "strip-json-comments";
import config from "../config";
import chalk from "chalk";

/** 获取默认的配置项，需要读取文件 */
export const getDefaultConfig = () => {
  const file = readFileSync(resolve(__dirname, '../tpl/as.config.json'), "utf-8")
  return JSON.parse(stripJsonComments(file)) as typeof asc
};

/** 获取用户配置项，需要读取文件 */
export const getUserConfig = () => {
  const file = readFileSync(resolve(process.cwd(), 'as.config.json'), 'utf-8')
  return JSON.parse(stripJsonComments(file)) as typeof asc
}

/** 默认配置项 */
export const defaultConfig = getDefaultConfig();

/** 用户配置项 */
export const userConfig = getUserConfig();

/**
 * 获取配置项
 * @param key 配置项的键名
 * @returns 配置项
 */
export const getConfig = <K extends keyof typeof asc>(key: K): (typeof asc)[K] => {
  if (!config.requiredConfig.includes(key)) {
    return userConfig[key] || defaultConfig[key]
  } else if (userConfig[key]){
    return userConfig[key]
  }
  console.log(chalk.red(`❌ 缺少必填配置项：${key}`))
  process.exit()
}


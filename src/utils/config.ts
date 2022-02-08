/*
 * @Author: zml
 * @Date: 2022-01-06 21:24:29
 * @LastEditTime: 2022-02-08 11:20:27
 */
import { resolve } from "path";
import type asc from '@/tpl/asconfig'
import config from "@/config";
import chalk from "chalk";
import { getParams } from "./params";

/** 默认配置项 */
let defaultConfig: (typeof asc) | undefined

/** 用户配置项 */
let userConfig: (typeof asc) | undefined

/** 获取默认的配置项，需要读取文件 */
export const getDefaultConfig = () => {
  if (defaultConfig) {
    return defaultConfig
  }
  defaultConfig = require('@/tpl/asconfig') as typeof asc
  return defaultConfig
};

/** 获取用户配置项，需要读取文件 */
export const getUserConfig = () => {
  const params = getParams()
  try {
    if (userConfig) {
      return userConfig
    }
    userConfig = require(resolve(process.cwd(), params.configFile)) as typeof asc
    return userConfig
  } catch (error) {
    console.log(`读取配置文件失败，请检查是否存在文件：${chalk.yellow(resolve(process.cwd(), params.configFile))}`)
    process.exit()
  }
}

/**
 * 获取配置项
 * @param key 配置项的键名
 * @returns 配置项
 */
export const getConfig = <K extends keyof typeof asc>(key: K): (typeof asc)[K] => {
  if (!config.requiredConfig.includes(key)) {
    return getUserConfig()[key] || getDefaultConfig()[key]
  } else if (getUserConfig()[key]){
    return getUserConfig()[key]
  }
  console.log(chalk.red(`❌ 缺少必填配置项：${key}`))
  process.exit()
}


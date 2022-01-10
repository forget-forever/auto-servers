import { readFileSync } from "fs";
import { resolve } from "path";
import type asc from '../tpl/as.config.json'
import stripJsonComments from "strip-json-comments";

/** 获取默认的配置项，需要读取文件 */
export const getDefaultConfig = () => {
  const file = readFileSync(resolve(__dirname, '../tpl/as.config.json'), "utf-8")
  return JSON.parse(stripJsonComments(file)) as typeof asc
};

export const getUserConfig = () => {
  const file = readFileSync(resolve(process.cwd(), 'as.config.json'), 'utf-8')
  return JSON.parse(stripJsonComments(file)) as typeof asc
}
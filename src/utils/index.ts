import { readFileSync } from "fs";
import path from "path";
import type asc from '../tpl/as.config.json'
import stripJsonComments from "strip-json-comments";

/** 获取默认的配置项，需要读取文件 */
export const getDefaultConfig = () => {
  const file = readFileSync(path.resolve(__dirname, '../tpl/as.config.json'), "utf-8")
  return JSON.parse(stripJsonComments(file)) as typeof asc
};
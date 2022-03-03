/*
 * @Author: zml
 * @Date: 2022-01-12 13:05:20
 * @LastEditTime: 2022-02-24 14:19:17
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmdirSync, statSync, unlinkSync } from "fs";
import { compile } from "json-schema-to-typescript";
import { join } from "path";
import { getParams } from "./params";
import Logs from "./ProgressLogs";

export * from './util'

export const ProgressLogs = Logs

/**
 * 终端输出字符串
 * @param msg 字符串，支持chalk字符串
 * @param type 什么模式下输出，默认 ‘all’
 * @param exit 是否结束流程
 */
export const info = (msg: Parameters<typeof console.info>[0], type: 'debug' | 'all' = 'all', exit = false) => {
  switch(type) {
    case 'all':
      console.info(msg);
      break;
    case 'debug':
      if (getParams().debug) {
        console.info(msg)
      }
      break;
  }
  if (exit) {
    process.exit()
  }
}

/**
 * 打印分割线
 */
export const infoSplitLine = () => {
  info('------------------------------------')
}

/**
 * 生成带query参数的url
 * @param url 
 * @param data 
 * @returns 
 */
export const httpBuilderUrl = (url: string, data: Record<string, string>) => {
  if(typeof(url) == 'undefined' || url == null || url == '') {
    return '';
  }
  if(typeof(data) == 'undefined' || data == null || typeof(data) != 'object') {
    return '';
  }
  url += (url.indexOf("?") != -1) ? "" : "?";
  for(const k in data) {
    url += ((url.indexOf("=") != -1) ? "&" : "") + k + "=" + encodeURI(data[k]);
  }
  return url;
}

/**
 * 去除字符串开头的空格和换行
 * @param str 
 * @returns 
 */
 export const deleteNullStr = (str: string) => str.replace(/^[\n\s\t]*|[\n\s\t]*$/g, '')

/**
 * 编译类型的自己封装的方法，去除了 [k: string]: unknown;额外添加的类型
 * @param args compile的参数
 * @returns 
 */
export const compileType: typeof compile = async (...args) => {
  try {
    const typeRes = await compile(...args)
    return deleteNullStr(typeRes.replace(/(\s)*(\n)*(\s)*(\[k: string\]: unknown;)/g, '').replace(/^(.*)(export(\s)+)/s, ''))
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * 复制文件夹
 * @param src 源路径
 * @param dest 目标路径
 * @returns 
 */
export const copyDirectory = (src: string, dest: string) => {
  if (existsSync(src) == false) {
    return;
  }
  if (existsSync(dest) == false) {
    mkdirSync(dest, {recursive: true});
  }
  // console.log("src:" + src + ", dest:" + dest);
  // 拷贝新的内容进去
  const dirs = readdirSync(src);
  dirs.forEach((item) => {
    const item_path = join(src, item);
    const temp = statSync(item_path);
    if (temp.isFile()) { // 是文件
      // console.log("Item Is File:" + item);
      copyFileSync(item_path, join(dest, item));
    } else if (temp.isDirectory()){ // 是目录
      // console.log("Item Is Directory:" + item);
      copyDirectory(item_path, join(dest, item));
    }
  });
}

/**
 * 清空文件夹
 * @param dir 文件夹路径
 */
export const deleteDirectory = (dir: string) => {
  if (existsSync(dir) == true) {
    const files = readdirSync(dir);
    files.forEach(function(item){
      const item_path = join(dir, item);
      // console.log(item_path);
      if (statSync(item_path).isDirectory()) {
        deleteDirectory(item_path);
      }
      else {
        unlinkSync(item_path);
      }
    });
    rmdirSync(dir);
  }
}

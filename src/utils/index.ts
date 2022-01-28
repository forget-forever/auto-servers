/*
 * @Author: zml
 * @Date: 2022-01-12 13:05:20
 * @LastEditTime: 2022-01-28 17:46:29
 */
import { compile } from "json-schema-to-typescript";
import { getParams } from "./params";

/**
 * 终端输出字符串
 * @param msg 字符串，支持chalk字符串
 * @param type 什么模式下输出，默认全部
 */
export const info = (msg: Parameters<typeof console.info>[0], type: 'debug' | 'all' = 'all') => {
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
 * 编译类型的自己封装的方法，去除了 [k: string]: unknown;额外添加的类型
 * @param args compile的参数
 * @returns 
 */
export const compileType: typeof compile = async (...args) => {
  try {
    const typeRes = await compile(...args)
    return typeRes.replace(/(\s)*(\n)*(\s)*(\[k: string\]: unknown;)/g, '')
  } catch (error) {
    return Promise.reject(error)
  }
}

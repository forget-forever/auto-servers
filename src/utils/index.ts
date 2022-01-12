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
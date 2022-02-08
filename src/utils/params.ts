import config from "@/config"

/**
 * 命令行启动参数
 */
 export const commandParam = {
  /** -t 参数，在没有的时候会使用获取全部的接口，有的时候先判定是否是接口的集合，不是的话那就当作url获取抓取接口数据 */
  type: '',
  /** -c 参数，没有的时候使用当前目录所获取到的唯一一个.config.js，否则出选框选择 */
  configFile: config.defalutConfigName,
  /** -d 参数，debug模式, 空字符串代表不开启 */
  debug: '',
}

/**
 * 写入参数
 * @param data 
 */
export const setParams = (data: Partial<typeof commandParam>) => {
  Object.keys(data).forEach((k) => {
    commandParam[k] = data[k] || commandParam[k]
  })
  // if(data.name) {
  //   commandParam.name = data.name;
  // }
  // if(data.option) {
    
  // }
}

/**
 * 获取参数
 * @returns 
 */
export const getParams = () => commandParam
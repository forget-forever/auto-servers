/**
 * 命令行启动参数
 */
 export const commandParam = {
  /** 第一个参数，在没有的时候会使用获取全部的接口，有的时候先判定是否是接口的集合，不是的话那就当作url获取抓取接口数据 */
  name: '',
  /** 第二个参数，没有的时候使用当前目录所获取到的唯一一个.config.js，否则出选框选择 */
  option: 'as.config.json'
}

/**
 * 写入参数
 * @param data 
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const setParams = (data: typeof commandParam) => {
  Object.keys(data).forEach((k) => {
    commandParam[k] = data[k]
  })
}

/**
 * 获取参数
 * @returns 
 */
export const getParams = () => commandParam
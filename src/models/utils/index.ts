/*
 * @Author: zml
 * @Date: 2022-02-08 15:39:50
 * @LastEditTime: 2022-02-09 15:50:24
 */
import config from "@/config"
import { getConfig } from "@/utils/config"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { resolve } from "path"
import { OneListItem } from "../create/listType"
export * from './functionHandele'

const getFileTpl = () => {
  const configModel = getConfig('importModel').map((item) => item.replace(/;/g, ''))
  const extendName = getConfig('extendName')
  if (extendName.includes('ts')) {
    configModel.push(`import * as Type from './type'`)
  }
  return configModel.join(';\n')
}

/**
 * 获取一个接口的目录
 * @param api 接口的基本信息
 * @returns 接口所在的路径信息
 */
 export const getPath = (api: OneListItem) => {
  const extendName = getConfig('extendName')
  const path = resolve(config.rootDir, `tmp/${api.pathType}`)
  const file = resolve(path, `index${extendName}`)
  if (!existsSync(path)) {
    mkdirSync(path, {recursive: true})
    writeFileSync(file, `${getFileTpl()};\n\n`)
  }
  return {file, path}
}

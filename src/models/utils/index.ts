/*
 * @Author: zml
 * @Date: 2022-02-08 15:39:50
 * @LastEditTime: 2022-02-10 15:12:42
 */
import config from "@/config"
import { getConfig } from "@/utils/config"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { camelCase, last } from "lodash"
import { resolve } from "path"
import { ApiDetail } from "../create/detailType"
import { OneListItem } from "../create/listType"
export * from './functionHandele'
export * from './typeHandle'

const getFileTpl = () => {
  const configModel = getConfig('importModel').map((item) => item.replace(/;/g, ''))
  const extendName = getConfig('extendName')
  if (extendName.includes('ts')) {
    configModel.push(`import * as Type from './type'`)
  }
  return configModel.join(';\n')
}

/**
 * 获取一个生成接口的目标文件
 * @param api 接口的基本信息
 * @returns 接口所在的路径信息
 */
 export const getDest= (api: OneListItem) => {
  const extendName = getConfig('extendName')
  const path = resolve(config.rootDir, `tmp/${api.pathType}`)
  const file = resolve(path, `index${extendName}`)
  const typeFile = resolve(path, `type.d.ts`)

  if (!existsSync(path)) {
    mkdirSync(path, {recursive: true})
    const tpl = getFileTpl()
    writeFileSync(file, `${tpl}${tpl ? ';\n\n': ''}`)
  }
  return {file, path, typeFile}
}

export const getFunctionName = (api: OneListItem | ApiDetail<'str' | 'obj'>) => {
  const pathArr = api.path.split('/')
  return camelCase(last(pathArr)) || 'requestName'
}

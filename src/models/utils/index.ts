/*
 * @Author: zml
 * @Date: 2022-02-08 15:39:50
 * @LastEditTime: 2022-02-22 14:30:59
 */
import config from "@/config"
import { getConfig } from "@/utils/config"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { camelCase, last } from "lodash"
import { resolve } from "path"
import { ApiDetail } from "../create/detailType"
import { OneListItem } from "../create/listType"
import { getFunctionFileTpl } from "./functionHandele"
import { newTypeFile } from "./typeFileHandle"
export * from './functionHandele'
export * from './typeHandle'

/**
 * 获取一个生成接口的目标文件
 * @param api 接口的基本信息
 * @returns 接口所在的路径信息
 */
 export const getDest= (api: OneListItem) => {
  const extendName = getConfig('extendName')
  const path = resolve(config.rootDir, `tmp/${api.pathType}`)
  const file = resolve(path, `index${extendName}`)
  const typeFile = getConfig('tsType') ? resolve(path, `type.d.ts`) : ''

  if (!existsSync(path)) {
    mkdirSync(path, {recursive: true})
    writeFileSync(file, getFunctionFileTpl())
    if (typeFile) {
      writeFileSync(typeFile, newTypeFile())
    }
  }
  return {file, path, typeFile}
}

export const getFunctionName = (api: OneListItem | ApiDetail<'str' | 'obj'>) => {
  const braketsReg = /\/(\w)*\{(\w)+\}/g
  const colonReg = /\/(\w)*(:)(\w)+/g
  const pathArr = api.path.replace(braketsReg, '').replace(colonReg, '').split('/')
  return camelCase(last(pathArr)) || 'requestName'
}

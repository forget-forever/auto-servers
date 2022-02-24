/*
 * @Author: zml
 * @Date: 2022-02-08 15:39:50
 * @LastEditTime: 2022-02-24 15:22:17
 */
import config from "@/config"
import { getConfig } from "@/utils/config"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { camelCase, last } from "lodash"
import { resolve } from "path"
import { ApiDetail } from "../create/detailType"
import { OneListItem } from "../create/listType"
import { getFunctionFileTpl } from "./functionHandele"
import { newTypeFile } from "./typeFileHandle"
export * from './functionHandele'
export * from './typeHandle'

export const getNamespace = (file: string, typeFile: string) => {
  const regType = /(?<=(declare(\s)+namespace(\s)+))(.*)(?={)/
    // import type * as Request from ''
  const regFunc = /(?<=(import(\s)+(type)?(\s)+\*(\s)+as ))(.*)(?=((\s)+from))/g
  return (readFileSync(typeFile, 'utf-8').match(regType) || readFileSync(file, 'utf-8').match(regFunc) || [getConfig('typeNamespace')])[0].trim()
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
  const typeFile = getConfig('tsType') ? resolve(path, `type.d.ts`) : ''
  let namespace = ''

  if (!existsSync(path)) {
    mkdirSync(path, {recursive: true})
    writeFileSync(file, getFunctionFileTpl())
    if (typeFile) {
      writeFileSync(typeFile, newTypeFile())
    }
    namespace = getConfig('typeNamespace')
  }
  if (!namespace) {
    namespace = getNamespace(file, typeFile)
  }
  return {file, path, typeFile, namespace}
}

export const getFunctionName = (api: OneListItem | ApiDetail<'str' | 'obj'>) => {
  const braketsReg = /\/(\w)*\{(\w)+\}/g
  const colonReg = /\/(\w)*(:)(\w)+/g
  const pathArr = api.path.replace(braketsReg, '').replace(colonReg, '').split('/')
  return camelCase(last(pathArr)) || 'requestName'
}
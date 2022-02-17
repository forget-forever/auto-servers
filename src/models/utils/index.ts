/*
 * @Author: zml
 * @Date: 2022-02-08 15:39:50
 * @LastEditTime: 2022-02-17 11:41:04
 */
import config from "@/config"
import { getConfig } from "@/utils/config"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { camelCase, last } from "lodash"
import { resolve } from "path"
import { ApiDetail } from "../create/detailType"
import { OneListItem } from "../create/listType"
import { getFunctionFileTpl } from "./functionHandele"
import { newFile } from "./typeFileHandle"
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
  const typeFile = resolve(path, `type.d.ts`)

  if (!existsSync(path)) {
    mkdirSync(path, {recursive: true})
    const tpl = getFunctionFileTpl()
    writeFileSync(file, `${tpl}${tpl ? ';\n\n': ''}`)
    writeFileSync(typeFile, newFile())
  }
  return {file, path, typeFile}
}

export const getFunctionName = (api: OneListItem | ApiDetail<'str' | 'obj'>) => {
  const pathArr = api.path.split('/')
  return camelCase(last(pathArr)) || 'requestName'
}

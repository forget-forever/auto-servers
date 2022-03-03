/*
 * @Author: zml
 * @Date: 2022-02-08 14:55:47
 * @LastEditTime: 2022-03-03 19:05:28
 */
import config from "@/config"
import { copyDirectory, info } from "@/utils"
import { getConfig } from "@/utils/config"
import { exec } from "child_process"
import { existsSync, rmdirSync } from "fs"
import { resolve } from "path"

/**
 * 文件的预处理，会把输出目录存储到tmp的缓存区
 */
export const filePreHandle = () => {
  const outPath = resolve(process.cwd(), getConfig('outPath'))
  const dest = resolve(config.rootDir, 'tmp')
  // 存在的话就，删除文件
  if (existsSync(dest)) {
    rmdirSync(dest, {recursive: true})
  }
  if (existsSync(outPath)) {
    copyDirectory(outPath, dest)
  }
}

/**
 * 完成处理后，重新生成servers
 */
export const fileAfterHandle = () => {
  const outPath = resolve(process.cwd(), getConfig('outPath'))
  const dest = resolve(config.rootDir, 'tmp')
  const projectPrettier = resolve(process.cwd(), '.prettierrc.js')
  let prettierrc =''
  if (existsSync(projectPrettier)) {
    prettierrc = projectPrettier
  } else {
    prettierrc = resolve(config.rootDir, '../.prettierrc.js')
  }
  const thisDir = process.cwd()
  const cliDir = resolve(config.rootDir, '../')
  info(`美化生成文件: ${prettierrc}`)
  info(`脚手架目录: ${cliDir}`, 'debug')
  info(`项目目录: ${thisDir}`, 'debug')
  try {
    exec(`cd ${cliDir} && npx prettier --config ${prettierrc} --write ${dest} && cd ${thisDir}`, () => {
      if (existsSync(dest)) {
        copyDirectory(dest, outPath)
      }
      rmdirSync(dest, {recursive: true})
    })
  } catch (error) {
    exec(`cd ${thisDir}`)
    info(`prettier 文件异常`)
    if (existsSync(dest)) {
      copyDirectory(dest, outPath)
    }
    rmdirSync(dest, {recursive: true})
  }
}

/*
 * @Author: zml
 * @Date: 2022-02-08 14:55:47
 * @LastEditTime: 2022-03-24 16:44:10
 */
import config from "@as-src/config"
import { copyDirectory, info } from "@as-src/utils"
import { getConfig } from "@as-src/utils/config"
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
  const thisDir = process.cwd()
  const projectPrettier = resolve(thisDir, '.prettierrc.js')
  const cliDir = resolve(config.rootDir, 'tpl/')
  let prettierrc =''
  if (existsSync(projectPrettier)) {
    prettierrc = projectPrettier
  } else {
    prettierrc = resolve(cliDir, '.prettierrc.js')
  }
  info(`通过 ${prettierrc} 美化生成的代码`)
  info(`脚手架目录: ${cliDir}`, 'debug')
  info(`项目目录: ${thisDir}`, 'debug')
  try {
    exec(`cd ${cliDir} && npx prettier --config ${prettierrc} --write ${dest} && cd ${thisDir}`, (err) => {
      if (err) {
        info(`prettier 格式化异常, 请检查输出文件是否符合逻辑`)
        info(err)
      }
      if (existsSync(dest)) {
        copyDirectory(dest, outPath)
      }
      rmdirSync(dest, {recursive: true})
    })
  } catch (error) {
    exec(`cd ${thisDir}`)
    if (existsSync(dest)) {
      copyDirectory(dest, outPath)
    }
    rmdirSync(dest, {recursive: true})
  }
}

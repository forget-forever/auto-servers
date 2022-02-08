/*
 * @Author: zml
 * @Date: 2022-02-08 14:55:47
 * @LastEditTime: 2022-02-08 16:40:50
 */
import config from "@/config"
import { copyDirectory } from "@/utils"
import { getConfig } from "@/utils/config"
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
  if (existsSync(dest)) {
    copyDirectory(dest, outPath)
  }
  rmdirSync(dest, {recursive: true})
}

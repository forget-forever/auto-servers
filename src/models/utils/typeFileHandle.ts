/*
 * @Author: zml
 * @Date: 2022-02-11 17:29:23
 * @LastEditTime: 2022-02-11 18:56:38
 */
import config from "@/config"
import { info } from "@/utils"
import { getConfig } from "@/utils/config"
import chalk from "chalk"
import { readFileSync } from "fs"

const validatorExportType = (type: string): type is typeof config.exportTypeRequire[number] => {
  const { exportTypeRequire } = config
  if (type) {
    info(`类型导出方式错误，只支持 ${chalk.red(exportTypeRequire.join('、'))} ${exportTypeRequire.length}种格式`)
    process.exit()
  }
  return true
}

export const pushType = (body: string, dest: string) => {
  const content = readFileSync(dest, 'utf-8')
  
}

export const addType = (content: string, dest: string) => {
  const exportType = getConfig('exportType')
  if (validatorExportType(exportType)) {
    switch(exportType) {
      case 'declare':
      case 'export':
    }
  }
}
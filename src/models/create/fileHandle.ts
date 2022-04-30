/*
 * @Author: zml
 * @Date: 2022-02-08 14:55:47
 * @LastEditTime: 2022-03-29 14:56:05
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
 * eslint处理文件
 * @param thisDir 项目路径
 * @param dest 需要处理的文件目录
 */
const eslintHandle = (thisDir: string, dest: string) => {
  // eslint配置文件的路径
  const projectEslintrc1 = resolve(thisDir, '.eslintrc.js')
  const projectEslintrc2 = resolve(thisDir, '.eslintrc')
  const projectEslintrc3 = resolve(thisDir, '.eslintrc.json')

  if (existsSync(projectEslintrc1) || existsSync(projectEslintrc2) || existsSync(projectEslintrc3)) {
    const eslintrcShell = `npx eslint --fix ${dest}`
    info('eslint 优化文件')
    return new Promise<void>((reso) => {
      exec(eslintrcShell, (err) => {
        if (err) {
          info(`eslint 格式化异常, 请检查输出文件是否符合逻辑`)
          info(err)
        }
        reso()
      })
    })
  } else {
    return Promise.resolve()
  }
}

/**
 * prettier 处理临时文件
 * @param thisDir 项目目录
 * @param cliDir 脚手架临时文件目录
 * @param dest 生成的临时文件目录
 * @returns 
 */
const prettierHandle = (thisDir: string, cliDir: string, dest: string) => {
  // prettier样例路径
  const projectPrettier = resolve(thisDir, '.prettierrc.js')
  let prettierrc =''
  if (existsSync(projectPrettier)) {
    prettierrc = projectPrettier
  } else {
    prettierrc = resolve(cliDir, 'sample.prettierrc.js')
  }
  
  info(`通过 ${prettierrc} 美化生成的代码`)
  info(`脚手架目录: ${cliDir}`, 'debug')
  info(`项目目录: ${thisDir}`, 'debug')
  return new Promise<void>((reso) => {
    exec(`cd ${cliDir} && npx prettier --config ${prettierrc} --write ${dest} && cd ${thisDir}`, (err) => {
      if (err) {
        info(`prettier 格式化异常, 请检查输出文件是否符合逻辑`)
        info(err)
      }
      reso()
    })
  })
}

/**
 * 完成处理后，重新生成servers
 */
export const fileAfterHandle = async () => {
  // 运行目录的
  const thisDir = process.cwd()
  // 脚手架目录
  const cliDir = resolve(config.rootDir, 'tpl/')
  // 临时文件目录
  const dest = resolve(config.rootDir, 'tmp')
  // 输出牡蛎
  const outPath = resolve(thisDir, getConfig('outPath'))

  await prettierHandle(thisDir, cliDir, dest)
  
  if (existsSync(dest)) {
    copyDirectory(dest, outPath)
  }
  rmdirSync(dest, {recursive: true})

  await eslintHandle(thisDir, outPath)

}

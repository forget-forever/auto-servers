/*
 * @Author: zml
 * @Date: 2022-02-09 15:27:10
 * @LastEditTime: 2022-02-11 16:16:42
 */
import { readFileSync, writeFileSync } from "fs"

/**
 * 将方法放入文件中
 * @param name 方法名
 * @param body 方法的内容
 * @param src 放入的路径
 * @param comment 方法的注释
 */
export const pushFunction = (name: string, body: string, src: string, comment?: string) => {
  let content = readFileSync(src, 'utf-8')
  if (comment) {
    content += `/** ${comment} */\n`
  }
  writeFileSync(src, `${content}export const ${name} = ${body}\n\n`)
}
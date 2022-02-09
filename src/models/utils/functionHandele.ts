/*
 * @Author: zml
 * @Date: 2022-02-09 15:27:10
 * @LastEditTime: 2022-02-09 15:56:30
 */
import { readFileSync, writeFileSync } from "fs"

export const pushFunction = (name: string, body: string, src: string) => {
  const content = readFileSync(src)
  writeFileSync(src, `${content}export const ${name} = ${body}\n\n`)
}
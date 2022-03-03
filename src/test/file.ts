import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

/*
 * @Author: zml
 * @Date: 2022-03-03 18:00:22
 * @LastEditTime: 2022-03-03 18:59:41
 */
module.exports = () => {
  const path = resolve(__dirname, './inita.ts')
  console.log(path)
  return existsSync(path)
}
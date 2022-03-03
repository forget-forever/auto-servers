// import { readdirSync } from "fs"

/*
 * @Author: zml
 * @Date: 2022-03-03 17:02:00
 * @LastEditTime: 2022-03-03 17:09:43
 */
module.exports = () => {
  const conf = require('../../.prettierrc.js')
  console.log(require('prettier').format(`var a={a: 1, b:2}`, conf))
}
/*
 * @Author: zml
 * @Date: 2022-01-10 16:49:23
 * @LastEditTime: 2022-02-08 11:19:48
 */
// import pinyin from "pinyin"
import { translate } from "@as-src/servers"

const init = async () => {
  // console.log(pinyin('aaa/aa').join())
  const res = await translate(['苹果', '测试'])
  console.log(res)
}

module.exports = init
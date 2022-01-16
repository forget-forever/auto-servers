// import pinyin from "pinyin"
import { translate } from "../servers"

const init = async () => {
  // console.log(pinyin('aaa/aa').join())
  const res = await translate(['苹果', '测试'])
  console.log(res)
}

module.exports = init
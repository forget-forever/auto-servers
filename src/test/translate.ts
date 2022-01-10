import { translate } from "../servers"

const init = async () => {
  const res = await translate(['苹果', '测试'])
  console.log(res)
}

module.exports = init
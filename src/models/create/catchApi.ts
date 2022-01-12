import { info } from "../../utils";
import { OneListItem } from "./type";
// import typeofJsonc from "typeof-jsonc";

const catchApi = async (api: OneListItem) => {
  info(`>> 开始生成接口： ${api.path}`)
}

export default catchApi
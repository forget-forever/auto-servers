// import { info } from "../../utils";
import { OneListItem } from "./type";
// import typeofJsonc from "typeof-jsonc";

const catchApi = (api: OneListItem) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(api)
    }, 300)
  })
  
}

export default catchApi
// import { info } from "../../utils";
import { getYpiMsg } from "../../servers";
import { ApiDetail } from "./detailType";
import { OneListItem } from "./listType";
// import typeofJsonc from "typeof-jsonc";

const catchApi = async (api: OneListItem) => {
  await getYpiMsg<ApiDetail>('/api/interface/get', {
    formData: { id: api._id}
  })
  return 'success' as const
  // console.log(res.data.title)
}

export default catchApi
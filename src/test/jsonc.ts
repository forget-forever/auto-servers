import jsonc2type from "../utils/jsonc2type"
// import typeofJsonc from "typeof-jsonc"

/*
 * @Author: zml
 * @Date: 2022-02-28 11:04:06
 * @LastEditTime: 2022-02-28 14:02:10
 */
module.exports = () => {
  const str = `{
    "errno": 0,
    "errmsg": "success",
    "data": {
      /** 
       * 多行注释 
       * 多行注释
       */
        "isCelebrityShop":0,
        "isPreferentialPurchase":0,//是否开通城市特惠够
        "personDirectMode":0,//是否专人直送
        "cityPrice":{
            "basicWeight":"3",
            "basicDistance":"3",
            "upperWeigh":"100",
            "upperDistance":"100",
        },
        "openTime":{
            "startTime":0,
            "endTime":86400,
        },
        "fixedTag":["请先电话联系","需要发票","按图购买","谢谢"],//帮我买固定标签
        "paymentList":[{"payType":"1","payName":"在线支付"}],//支付方式
        "productLabels":[
            {
            "name":"随意购",
            "content":"请填写商品名称和数量，例如：帮我买一把雨伞。",
            "iconUrl":"http://crm-1258916733.cos.ap-shanghai_random%403x.png",
            "subLabels":["扑克牌","喜茶","电池","洗发水","烟","雨伞"],
            },
            {
            "name":"随意购",
            "content":"请填写商品名称和数量，例如：帮我买一把雨伞。",
            "iconUrl":"http://crm-1258916733.cos.ap-shanghai_random%403x.png",
            "subLabels":["扑克牌","喜茶","电池","洗发水","烟","雨伞","充电器"],
            },
            {
            "name":"随意购",
            "content":"请填写商品名称和数量，例如：帮我买一把雨伞。",
            "iconUrl":"http://crm-1258916733.cos.ap-shanghai_random%403x.png",
            "subLabels":["扑克牌","喜茶","电池","洗发水","烟"],
            },
            {
            "name":"随意购",
            "content":"请填写商品名称和数量，例如：帮我买一把雨伞。",
            "iconUrl":"http://crm-1258916733.cos.ap-shanghai_random%403x.png",
            "subLabels":["扑克牌","喜茶","电池","洗发水"],
            },
            {
            "name":"随意购",
            "content":"请填写商品名称和数量，例如：帮我买一把雨伞。",
            "iconUrl":"http://crm-1258916733.cos.ap-shanghai_random%403x.png",
            "subLabels":["扑克牌","喜茶","电池","洗发水","烟","雨伞"],
            },
            {
            "name":"随意购",
            "content":"请填写商品名称和数量，例如：帮我买一把雨伞。",
            "iconUrl":"http://crm-1258916733.cos.ap-shanghai_random%403x.png",
            "subLabels":["扑克牌","喜茶","电池","洗发水",],
            },
            {
            "name":"随意购",
            "content":"请填写商品名称和数量，例如：帮我买一把雨伞。",
            "iconUrl":"http://crm-1258916733.cos.ap-shanghai_random%403x.png",
            "subLabels":["扑克牌","喜茶","电池","洗发水"],
            },
            {
            "name":"随意购",
            "content":"请填写商品名称和数量，例如：帮我买一把雨伞。",
            "iconUrl":"http://crm-1258916733.cos.ap-shanghai_random%403x.png",
            "subLabels":["扑克牌","喜茶","电池","洗发水","烟","雨伞","充电器"],
            },
        ],
        "remarkTagList":["无接触配送", "上门前请电话我哦","十分感谢","请快马加鞭"]
    },
    "lid": "525708616429257854"
}`
return jsonc2type(str, {startNode: 'Data', name: 'Request'})
}
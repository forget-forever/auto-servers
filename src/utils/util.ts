/*
 * @Author: zml
 * @Date: 2022-01-27 14:16:36
 * @LastEditTime: 2022-01-27 16:38:24
 */

/**
 * 对象遍历的方法
 * @param obj 对象
 * @param cb 遍历回调函数: cb: ( key: 对象的键名  item: 对象的键值  obj: 当前处理中的对象 ) => Partial<OBJ>
 * @returns 处理之后的对象
 */
 export const objMap = <K extends string | number, P, R>(
  obj: Record<K, P>,
  cb: (
    /** 对象的键名 */
    key: K,
    /** 对象的键值 */
    item: P,
    /** 当前处理中的对象 */
    obj: Partial<Record<K, R>>
  ) => Partial<Record<K, R>>
) => {
  return Object.entries(obj).reduce(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (pre, [k, v]) => ({ ...pre, ...cb(k, v, pre)}),
    {} as Record<K, R>
  )
}
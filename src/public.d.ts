/**
   * 自己定义的Omit类型
   */
declare type MyOmit<T, K extends keyof T> = Omit<T, K>;


declare interface ObjectConstructor {
  entries<T>(o: T): [keyof T, T[keyof T]][];
  keys<T extends object>(o: T): (keyof T)[];
}

// 取返回值是Promise中的值
declare type PromiseReturn<F> = ReturnType<F> extends Promise<infer R> ? R : never;

declare type ValueOf<T> = T extends { [K in keyof T]: infer V } ? V : never;
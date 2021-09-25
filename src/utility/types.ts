export type Primitive = string | number | boolean | bigint
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

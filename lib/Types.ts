
export type AnyAsyncFn = (...args: any[]) => Promise<any>

export type AnyFn      = (...args: any[]) => any

export type AnyKey     = string | number | symbol

/** Simple Transformation Function */
export type Xf<A, B> = (a: A) => B

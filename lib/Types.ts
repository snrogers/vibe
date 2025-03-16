import type { z } from "zod"

export type AnyAsyncFn = (...args: any[]) => Promise<any>

export type AnyFn      = (...args: any[]) => any

export type AnyKey     = string | number | symbol

export type AnyZodType = z.ZodType<any>

export type Simplify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

/** Simple Transformation Function */
export type Xf<A, B> = (a: A) => B

